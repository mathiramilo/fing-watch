use reqwest::{header, Error};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::io::prelude::*;

pub struct TheMovieDB {
    token: String,
    images_path: &'static str,
}

impl TheMovieDB {
    pub fn new(token: String, images_path: &'static str) -> Self {
        Self { token, images_path }
    }

    async fn download_tmdb_image(&self, tmdb_path: &str) -> Result<(), Error> {
        let file_path = self.images_path.to_owned() + tmdb_path;

        let buf = reqwest::Client::new()
            .get("http://image.tmdb.org/t/p/w500".to_owned() + tmdb_path)
            .bearer_auth(&&self.token)
            .send()
            .await?
            .bytes()
            .await?;

        let res = fs::File::create(file_path).and_then(|mut f| f.write_all(&buf));

        if let Err(e) = res {
            eprintln!("{}", e);
        }

        Ok(())
    }

    pub async fn fetch_movies_details(&self, page: u32) -> Result<Vec<MovieDetails>, Error> {
        let movies_response = self.fetch_movies(page).await?;

        let mut movies = vec![];

        for movie in movies_response.results.iter() {
            let result = self.fetch_details(movie.id).await?;

            // download images
            if let Some(details) = result {
                self.download_tmdb_image(&details.poster_path).await?;
                self.download_tmdb_image(&details.backdrop_path).await?;

                movies.push(details);
            }
        }

        Ok(movies)
    }

    async fn fetch_movies(&self, page: u32) -> Result<MoviesResponse, Error> {
        let resp = reqwest::Client::new()
            .get("https://api.themoviedb.org/3/movie/popular")
            .query(&[("page", page)])
            .bearer_auth(&self.token)
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

    async fn fetch_details(&self, id: u32) -> Result<Option<MovieDetails>, Error> {
        let resp = reqwest::Client::new()
            .get(format!("https://api.themoviedb.org/3/movie/{}", id))
            .bearer_auth(&self.token)
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
}

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
    #[serde(skip)]
    pub keywords: Vec<Keyword>,
    pub original_language: String,
    pub overview: String,
    pub popularity: f64,
    pub poster_path: String,
    pub release_date: String,
    pub runtime: u32,
    pub status: String,
    pub tagline: String,
    pub title: String,
    pub vote_average: f64,
    #[serde(skip_deserializing)]
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
