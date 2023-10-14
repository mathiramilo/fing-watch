use serde::{Deserialize, Serialize};
use serde_json::{Map, Value};

#[derive(Debug, Deserialize, Serialize)]
pub struct MoviesResponse {
    pub page: u32,
    pub results: Vec<Movie>,
    pub total_pages: u32,
    pub total_results: u32,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Movie {
    pub id: u32,
    pub adult: bool,
    pub backdrop_path: Option<String>,
    pub genre_ids: Vec<u32>,
    pub original_language: String,
    pub original_title: String,
    pub overview: String,
    pub popularity: f64,
    pub poster_path: Option<String>,
    pub release_date: String,
    pub title: String,
    #[serde(skip)]
    pub video: bool,
    pub vote_average: f64,
    pub vote_count: u32,
    #[serde(default)]
    pub runtime: u32,
    #[serde(default)]
    pub tagline: String,
    #[serde(default)]
    pub status: String,
    #[serde(default)]
    #[serde(skip_serializing)]
    pub keywords: Vec<Keyword>,
    #[serde(default)]
    pub watch_providers: std::collections::HashMap<String, Providers>,
}

impl Movie {
    pub fn set_details(&mut self, details: MovieDetails) {
        self.runtime = details.runtime;
        self.status = details.status;
        self.tagline = details.tagline;
        self.keywords = details.keywords.keywords;
        self.watch_providers = details.watch_providers.results;
    }
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

// fn map_genre(id: u32) -> &'static str {
//     match id {
//         28 => "Action",
//         12 => "Adventure",
//         16 => "Animation",
//         35 => "Comedy",
//         80 => "Crime",
//         99 => "Documentary",
//         18 => "Drama",
//         10751 => "Family",
//         14 => "Fantasy",
//         36 => "History",
//         27 => "Horror",
//         10402 => "Music",
//         9648 => "Mystery",
//         10749 => "Romance",
//         878 => "Science Fiction",
//         10770 => "TV Movie",
//         53 => "Thriller",
//         10752 => "War",
//         37 => "Western",
//         _ => panic!("Invalid genre_id!"),
//     }
// }

impl Movie {
    // pub fn map_genres(&self) -> Vec<String> {
    //     self.genre_ids
    //         .iter()
    //         .map(|id| map_genre(*id).to_string())
    //         .collect()
    // }

    pub fn raw(&self) -> String {
        let raw_data = serde_json::to_string(self).unwrap();
        let mut parsed_data: Map<String, Value> = serde_json::from_str(&raw_data).unwrap();

        parsed_data["id"] = Value::from(parsed_data["id"].to_string());

        return serde_json::to_string(&parsed_data).unwrap();
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Collection {
    id: u32,
    name: String,
    poster_path: String,
    backdrop_path: String,
}
#[derive(Debug, Deserialize, Serialize)]
pub struct Genre {
    pub id: u32,
    pub name: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Company {
    id: u32,
    logo_path: String,
    name: String,
    origin_country: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Country {
    iso_3166_1: String,
    name: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Language {
    english_name: String,
    iso_639_1: String,
    name: String,
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

#[derive(Debug, Deserialize, Serialize)]
pub struct MovieDetails {
    pub adult: bool,
    pub backdrop_path: Option<String>,
    // #[serde(skip)]
    // pub belongs_to_collection: Option<Collection>,
    // #[serde(skip)]
    // pub budget: u32,
    pub genres: Vec<Genre>,
    // #[serde(skip)]
    // pub homepage: String,
    pub id: u32,
    // #[serde(skip)]
    // pub imdb_id: String,
    // #[serde(skip)]
    pub original_language: String,
    // #[serde(skip)]
    // pub original_title: String,
    pub overview: String,
    // pub popularity: f64,
    pub poster_path: Option<String>,
    // #[serde(skip)]
    // pub production_companies: Vec<Company>,
    // #[serde(skip)]
    // pub production_countries: Vec<Country>,
    pub release_date: String,
    // #[serde(skip)]
    // pub revenue: u32,
    pub runtime: u32,
    // #[serde(skip)]
    // pub spoken_languages: Vec<Language>,
    // #[serde(skip)]
    pub status: String,
    // #[serde(skip)]
    pub tagline: String,
    pub title: String,
    // #[serde(skip)]
    // pub video: bool,
    pub vote_average: f64,
    // #[serde(skip)]
    // pub vote_count: u32,
    #[serde(skip_serializing)]
    pub keywords: Keywords,

    #[serde(rename = "watch/providers")]
    pub watch_providers: WatchProviders,
}
