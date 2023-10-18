use reqwest::header;
use reqwest::Error;
use std::fs;
use std::thread;
use std::time::Duration;

use crate::tmdb::MovieDetails;

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

pub async fn typesense_init(recreate: bool) -> Result<(), Error> {
    wait_for_typesense(Duration::from_secs(1), Duration::from_secs(1)).await;

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

pub async fn typesense_post(movie: &MovieDetails) -> Result<(), Error> {
    let typesense = std::env::var("TYPESENSE").unwrap();
    let key: String = std::env::var("TYPESENSE_KEY").unwrap();

    reqwest::Client::new()
        .post(typesense + "/collections/movies/documents")
        .header(header::CONTENT_TYPE, "application/json")
        .header("X-TYPESENSE-API-KEY", key)
        .query(&[("action", "upsert")])
        .json(movie)
        .send()
        .await?;

    Ok(())
}
