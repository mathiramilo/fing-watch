use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct MoviesResponse {
    pub page: u32,
    pub results: Vec<Movie>,
    pub total_pages: u32,
    pub total_results: u32,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Movie {
    pub adult: bool,
    pub backdrop_path: Option<String>,
    pub genre_ids: Vec<u32>,
    pub id: u32,
    pub original_language: String,
    pub original_title: String,
    pub overview: String,
    pub popularity: f64,
    pub poster_path: String,
    pub release_date: String,
    pub title: String,
    pub video: bool,
    pub vote_average: f64,
    pub vote_count: u32,
    #[serde(default)]
    pub keywords: Vec<Keyword>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct KeywordsResponse {
    pub id: u32,
    pub keywords: Vec<Keyword>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Keyword {
    pub id: u32,
    pub name: String,
}

fn map_genre(id: u32) -> &'static str {
    match id {
        28 => "Action",
        12 => "Adventure",
        16 => "Animation",
        35 => "Comedy",
        80 => "Crime",
        99 => "Documentary",
        18 => "Drama",
        10751 => "Family",
        14 => "Fantasy",
        36 => "History",
        27 => "Horror",
        10402 => "Music",
        9648 => "Mystery",
        10749 => "Romance",
        878 => "Science Fiction",
        10770 => "TV Movie",
        53 => "Thriller",
        10752 => "War",
        37 => "Western",
        _ => panic!("Invalid genre_id!"),
    }
}

impl Movie {
    pub fn map_genres(&self) -> Vec<String> {
        self.genre_ids
            .iter()
            .map(|id| map_genre(*id).to_string())
            .collect()
    }
}
