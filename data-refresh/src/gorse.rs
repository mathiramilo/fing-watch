use reqwest::{header, Error};
use serde::{Deserialize, Serialize};

use crate::tmdb::MovieDetails;

#[derive(Debug, Deserialize, Serialize)]
pub struct Item {
    #[serde(rename = "ItemId")]
    pub id: String,
    #[serde(rename = "IsHidden")]
    pub hidden: bool,
    #[serde(rename = "Categories")]
    pub categories: Vec<String>,
    #[serde(rename = "Timestamp")]
    pub timestamp: String,
    #[serde(rename = "Labels")]
    pub labels: Vec<String>,
    #[serde(rename = "Comment")]
    pub comment: String,
}

pub async fn gorse_post(movie: &MovieDetails) -> Result<(), Error> {
    let entry_point = std::env::var("GORSE_ENTRY_POINT").expect("GORSE_ENTRY_POINT must be set.");

    let item = Item {
        id: movie.id.to_owned(),
        hidden: false,
        categories: movie.genres.iter().map(|g| g.name.to_owned()).collect(),
        timestamp: movie.release_date.clone(),
        labels: movie.keywords.iter().map(|k| k.name.to_owned()).collect(),
        comment: movie.title.clone(),
    };

    reqwest::Client::new()
        .post(entry_point.to_owned() + "/api/item")
        .header(header::CONTENT_TYPE, "application/json")
        .header("X-API-Key", "")
        .json(&item)
        .send()
        .await?;

    Ok(())
}
