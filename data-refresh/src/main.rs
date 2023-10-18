pub mod gorse;
pub mod tmdb;
pub mod typesense;

use dotenv::dotenv;
use reqwest::Error;
use std::thread;
use std::time::Duration;

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

#[tokio::main]
async fn main() -> Result<(), Error> {
    dotenv().ok();

    typesense::typesense_init(true).await?;

    let mut pagging = Config::new(1440, Duration::from_secs(3));

    loop {
        let movies = tmdb::fetch_movies_data(pagging.next_page()).await?;

        for movie in movies.iter() {
            println!("{}: {}", movie.id, movie.title);

            typesense::typesense_post(movie).await?;
            gorse::gorse_post(movie).await?;

            thread::sleep(pagging.interval());
        }
    }
}
