pub mod gorse;
pub mod tmdb;

use gorse::Item;
use tmdb::{KeywordsResponse, Movie, MoviesResponse};

use mongodb::{
    bson::doc,
    bson::Document,
    options,
    options::{ClientOptions, ServerApi, ServerApiVersion},
    Client,
};
use reqwest::{self, Error};
use reqwest::{header, Response};

use serde_json;

use dotenv::dotenv;
use std::thread;
use std::time::Duration;

async fn fetch_movies(page: u32, token: &str) -> Result<MoviesResponse, Error> {
    let response = reqwest::Client::new()
        .get("https://api.themoviedb.org/3/movie/popular")
        .query(&[("page", page)])
        .bearer_auth(token)
        .header(
            header::ACCEPT,
            header::HeaderValue::from_static("application/json"),
        )
        .send()
        .await?;

    response.error_for_status_ref()?;

    let data = response.json().await?;

    Ok(data)
}

async fn fetch_keywords(id: u32, token: &str) -> Result<KeywordsResponse, Error> {
    let response = reqwest::Client::new()
        .get(format!(
            "https://api.themoviedb.org/3/movie/{}/keywords",
            id
        ))
        .bearer_auth(token)
        .header(
            header::ACCEPT,
            header::HeaderValue::from_static("application/json"),
        )
        .send()
        .await?;

    response.error_for_status_ref()?;

    let data = response.json().await?;

    Ok(data)
}

async fn gorse_post(entry_point: &str, movie: &Movie) -> Result<Response, Error> {
    let item = Item {
        id: movie.id.to_string(),
        hidden: false,
        categories: movie.map_genres(),
        timestamp: movie.release_date.clone(),
        labels: movie.keywords.iter().map(|k| k.name.clone()).collect(),
        comment: movie.title.clone(),
    };

    let json_payload = serde_json::to_string(&item).unwrap();

    let response = reqwest::Client::new()
        .post(format!("{}/api/item", entry_point))
        .header(header::CONTENT_TYPE, "application/json")
        .header("X-API-Key", "")
        .body(json_payload)
        .send()
        .await?;

    Ok(response)
}

async fn add_to_system(
    mongo_client: &Client,
    gorse_entry_point: &str,
    movie: &Movie,
) -> mongodb::error::Result<()> {
    let opts = options::UpdateOptions::builder().upsert(true).build();
    let query = doc! {"tmdb_id": movie.id};

    let update = doc! {"$set": {
       "title": &movie.title,
       "overview": &movie.overview,
       "genres": &movie.map_genres(),
       "adult": &movie.adult,
       "poster_path": &movie.poster_path,
       "backdrop_path": &movie.backdrop_path,
       "release_date": &movie.release_date,
    }};

    let result = mongo_client
        .database("data")
        .collection::<Document>("movies")
        .update_one(query, update, opts)
        .await?;

    if result.matched_count == 0 {
        let response = gorse_post(gorse_entry_point, movie).await;
        match response {
            Ok(response) => {
                if response.status() != 200 {
                    eprintln!("Error while posting item {}", movie.id);
                }
            }
            Err(err) => {
                eprintln!("Error while posting item: {:?}", err);
            }
        }
    }

    Ok(())
}

struct Config {
    max_page: u32,
    request_interval: Duration,
    page: u32,
}

impl Config {
    fn new(max_page: u32, request_interval: Duration) -> Self {
        Self {
            max_page,
            request_interval,
            page: 0,
        }
    }

    fn next_page(&mut self) -> u32 {
        self.page = (self.page % self.max_page) + 1;
        self.page
    }

    fn interval(&self) -> Duration {
        self.request_interval
    }
}

async fn fetch_movies_data(page: u32, token: &str) -> Result<MoviesResponse, Error> {
    let mut movies_response = fetch_movies(page, token).await?;

    for movie in movies_response.results.iter_mut() {
        let keywords_response = fetch_keywords(movie.id, token).await?;
        movie.keywords = keywords_response.keywords;
    }

    Ok(movies_response)
}

#[tokio::main]
async fn main() -> mongodb::error::Result<()> {
    dotenv().ok();

    let mongo_conn = std::env::var("MONGO_CONN").expect("MONGO_CON must be set.");
    let token = std::env::var("TMDB_API_KEY").expect("TMDB_API_KEY must be set.");
    let gorse_entry_point = std::env::var("GORSE_ENTRY_POINT").expect("TMDB_API_KEY must be set.");

    let mut client_options = ClientOptions::parse(&mongo_conn).await?;

    let server_api = ServerApi::builder().version(ServerApiVersion::V1).build();
    client_options.server_api = Some(server_api);

    let client = Client::with_options(client_options)?;

    // 1 request every 3 seconds
    let mut pagging = Config::new(1440, Duration::from_secs(3));

    loop {
        let result = fetch_movies_data(pagging.next_page(), &token).await;

        match result {
            Ok(movie_page) => {
                for movie in movie_page.results.iter() {
                    println!("{}", movie.title);
                    add_to_system(&client, &gorse_entry_point, movie).await?;
                    thread::sleep(pagging.interval());
                }
            }
            Err(err) => {
                eprintln!("Error while fetching movies: {:?}", err);
            }
        }
    }
}
