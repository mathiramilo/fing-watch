pub mod gorse;
pub mod tmdb;

use dotenv::dotenv;
use gorse::Item;
use reqwest::{header, Error};
use std::thread;
use std::time::Duration;
use tmdb::{Movie, MovieDetails, MoviesResponse};

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

async fn fetch_details(id: u32, token: &str) -> Result<MovieDetails, Error> {
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

    resp.error_for_status_ref()?;

    let data = resp.json().await?;

    Ok(data)
}

async fn gorse_post(movie: &Movie) -> Result<(), Error> {
    let entry_point = std::env::var("GORSE_ENTRY_POINT").expect("GORSE_ENTRY_POINT must be set.");

    let item = Item {
        id: movie.id.to_string(),
        hidden: false,
        categories: movie.genre_ids.iter().map(|g| g.to_string()).collect(),
        timestamp: movie.release_date.clone(),
        labels: movie.keywords.iter().map(|k| k.name.clone()).collect(),
        comment: movie.title.clone(),
    };

    reqwest::Client::new()
        .post(format!("{}/api/item", entry_point))
        .header(header::CONTENT_TYPE, "application/json")
        .header("X-API-Key", "")
        .json(&item)
        .send()
        .await?;

    Ok(())
}

async fn wait_for_typesense(interval: Duration, timeout: Duration) {
    let typesense = std::env::var("TYPESENSE").unwrap();
    let key: String = std::env::var("TYPESENSE_KEY").unwrap();

    loop {
        let resp = reqwest::Client::new()
            .get(typesense.to_owned() + "/health")
            .header(header::CONTENT_TYPE, "application/json")
            .timeout(timeout)
            .header("X-TYPESENSE-API-KEY", &key)
            .send()
            .await;

        if resp.is_ok_and(|resp| resp.status().is_success()) {
            eprintln!("Typesense is ready!");
            return;
        }

        eprintln!("Error while checking Typesense health.");
        thread::sleep(interval);
    }
}

async fn typesense_init(recreate: bool) -> Result<(), Error> {
    use std::fs;
    let typesense = std::env::var("TYPESENSE").unwrap();
    let key: String = std::env::var("TYPESENSE_KEY").unwrap();

    if recreate {
        // delete 'movies' collection
        let resp = reqwest::Client::new()
            .delete(typesense.to_owned() + "/collections/movies")
            .header(header::CONTENT_TYPE, "application/json")
            .header("X-TYPESENSE-API-KEY", &key)
            .send()
            .await?;
        println!("DELETING MOVIES COLLECTION ({})", resp.status());
    }

    // create 'movies' collection
    let data = fs::read_to_string("schema/movies.json").expect("Unable to read file.");
    let json_payload: serde_json::Value = serde_json::from_str(&data).expect("Unable to parse.");

    let resp = reqwest::Client::new()
        .post(typesense.to_owned() + "/collections")
        .header(header::CONTENT_TYPE, "application/json")
        .header("X-TYPESENSE-API-KEY", &key)
        .body(json_payload.to_string())
        .send()
        .await?;
    println!("CREATING MOVIES COLLECTION ({})", resp.status());

    Ok(())
}

async fn typesense_post(movie: &Movie) -> Result<(), Error> {
    let typesense = std::env::var("TYPESENSE").unwrap();
    let key: String = std::env::var("TYPESENSE_KEY").unwrap();

    reqwest::Client::new()
        .post(typesense + "/collections/movies/documents")
        .header(header::CONTENT_TYPE, "application/json")
        .header("X-TYPESENSE-API-KEY", key)
        .query(&[("action", "upsert")])
        .body(movie.raw())
        .send()
        .await?;

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

async fn fetch_movies_data(page: u32) -> Result<Vec<Movie>, Error> {
    let token = std::env::var("TMDB_API_KEY").expect("TMDB_API_KEY must be set.");

    let mut movies_response = fetch_movies(page, &token).await?;

    for movie in movies_response.results.iter_mut() {
        let details = fetch_details(movie.id, &token).await?;
        movie.set_details(details);
    }

    Ok(movies_response.results)
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    dotenv().ok();

    wait_for_typesense(Duration::from_secs(1), Duration::from_secs(1)).await;

    typesense_init(true).await?;

    // 1 request every 3 seconds
    let mut pagging = Config::new(1440, Duration::from_secs(3));

    loop {
        let movies = fetch_movies_data(pagging.next_page()).await?;

        for movie in movies.iter() {
            println!("{}: {}", movie.id, movie.title);

            typesense_post(&movie).await?;
            gorse_post(movie).await?;

            thread::sleep(pagging.interval());
        }
    }
}
