use reqwest::{header, Error};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::io::prelude::*;

#[derive(Debug, Deserialize, Serialize)]
pub struct MoviesResponse {
    pub page: u32,
    pub results: Vec<MovieID>,
    pub total_pages: u32,
    pub total_results: u32,
}
#[derive(Debug, Deserialize, Serialize)]
pub struct MovieID {
    pub id: u32,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Keywords {
    pub keywords: Vec<Keyword>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Keyword {
    pub id: u32,
    pub name: String,
}

pub fn parse(json: &HashMap<String, serde_json::Value>) -> Result<MovieDetails, serde_json::Error> {
    let s = serde_json::to_string(json)?;
    let mut details: MovieDetails = serde_json::from_str(&s)?;

    details.id = json["id"].to_string();
    details.watch_providers = Deserialize::deserialize(&json["watch/providers"]["results"])?;
    details.keywords = Deserialize::deserialize(&json["keywords"]["keywords"])?;

    Ok(details)
}

#[derive(Debug, Deserialize, Serialize)]
pub struct MovieDetails {
    pub adult: bool,
    pub backdrop_path: String,
    pub genres: Vec<Genre>,
    #[serde(skip_deserializing)]
    pub id: String,
    pub original_language: String,
    pub overview: String,
    pub poster_path: String,
    pub release_date: String,
    pub runtime: u32,
    pub status: String,
    pub tagline: String,
    pub title: String,
    pub vote_average: f64,
    #[serde(skip)]
    pub keywords: Vec<Keyword>,
    #[serde(skip_deserializing)]
    #[serde(rename = "watch/providers")]
    pub watch_providers: HashMap<String, Providers>,
}
#[derive(Debug, Deserialize, Serialize)]
pub struct Genre {
    pub id: u32,
    pub name: String,
}

#[derive(Debug, Deserialize, Serialize)]
struct Provider {
    logo_path: String,
    provider_id: u32,
    provider_name: String,
    display_priority: u32,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Providers {
    link: String,
    #[serde(default)]
    buy: Vec<Provider>,
    #[serde(default)]
    rent: Vec<Provider>,
    #[serde(rename = "flatrate")]
    flat_rate: Option<Vec<Provider>>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct WatchProviders {
    pub results: std::collections::HashMap<String, Providers>,
}

async fn download_tmdb_image(tmdb_path: &str, file_path: &str) -> Result<(), Error> {
    let token = std::env::var("TMDB_API_KEY").expect("TMDB_API_KEY must be set.");

    let data = reqwest::Client::new()
        .get("http://image.tmdb.org/t/p/w500".to_owned() + tmdb_path)
        .bearer_auth(token)
        .send()
        .await?
        .bytes()
        .await?;

    println!("{}", data.len());

    fs::File::create(file_path)
        .expect("Error while creating file.")
        .write_all(&data)
        .expect("Error while writing file.");

    Ok(())
}

pub async fn fetch_movies_data(page: u32) -> Result<Vec<MovieDetails>, Error> {
    let token = std::env::var("TMDB_API_KEY").expect("TMDB_API_KEY must be set.");

    let movies_response = fetch_movies(page, &token).await?;

    let mut movies = vec![];

    for movie in movies_response.results.iter() {
        let result = fetch_details(movie.id, &token).await?;

        if let Some(details) = result {
            movies.push(details);
        }

        // let mut file_path = "images".to_owned();
        // file_path.push_str(&details.poster_path.to_owned());
        // download_tmdb_image(&details.poster_path, &file_path).await?;
    }

    Ok(movies)
}

async fn fetch_movies(page: u32, token: &str) -> Result<MoviesResponse, Error> {
    let resp = reqwest::Client::new()
        .get("https://api.themoviedb.org/3/movie/popular")
        .query(&[("page", page)])
        .bearer_auth(token)
        .header(
            header::ACCEPT,
            header::HeaderValue::from_static("application/json"),
        )
        .send()
        .await?;

    resp.error_for_status_ref()?;

    let data = resp.json().await?;

    Ok(data)
}

async fn fetch_details(id: u32, token: &str) -> Result<Option<MovieDetails>, Error> {
    let resp = reqwest::Client::new()
        .get(format!("https://api.themoviedb.org/3/movie/{}", id))
        .bearer_auth(token)
        .header(
            header::ACCEPT,
            header::HeaderValue::from_static("application/json"),
        )
        .query(&[("append_to_response", "keywords,watch/providers")])
        .send()
        .await?;

    let data = resp.json().await?;
    let result = parse(&data);

    match result {
        Ok(details) => Ok(Some(details)),
        Err(e) => {
            eprintln!("Error while parsing {} fields. {}", id, e);
            Ok(None)
        }
    }
}
