pub mod gorse;
pub mod tmdb;
pub mod typesense;

use dotenv::dotenv;
use reqwest::Error;
use std::time::Duration;
use std::{env, thread};

#[tokio::main]
async fn main() -> Result<(), Error> {
    dotenv().ok();

    typesense::typesense_init(false).await?;

    let tmdb_client = tmdb::TheMovieDB::new(env::var("TMDB_API_KEY").unwrap(), "/images");
    let mut page = 1;

    loop {
        let movies = tmdb_client.fetch_movies_details(page).await?;

        for movie in movies.iter() {
            println!("{}: {}", movie.id, movie.title);

            typesense::typesense_post(movie).await?;
            gorse::gorse_post(movie).await?;

            thread::sleep(Duration::from_secs(5));
            page = (page % 500) + 1; // max page must be 500
        }
    }
}
