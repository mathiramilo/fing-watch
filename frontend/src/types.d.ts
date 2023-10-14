export interface MoviesListItem {
  adult: boolean
  backdrop_path: string
  genre_ids: number[]
  id: number
  tmdb_id: string
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  title: string
  video: boolean | string
  vote_average: number
  vote_count: number
}

export interface MovieDetails {
  adult: boolean
  backdrop_path: string
  belongs_to_collection: null | object
  budget: number
  genres: object[]
  homepage: string
  id: number
  tmdb_id: string
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  production_companies: object[]
  production_countries: object[]
  release_date: string
  revenue: number
  runtime: number
  spoken_languages: object[]
  status: string
  tagline: string
  title: string
  video: boolean | string
  vote_average: number
  vote_count: number
}

export interface SeriesListItem {
  backdrop_path: string
  first_air_date: string
  genre_ids: number[]
  id: number
  name: string
  origin_country: string[]
  original_language: string
  original_name: string
  overview: string
  popularity: number
  poster_path: string
  vote_average: number
  vote_count: number
}

export interface SeriesDetails {
  adult: boolean
  backdrop_path: string
  created_by: object[]
  episode_run_time: number[]
  first_air_date: string
  genres: object[]
  homepage: string
  id: number
  in_production: boolean
  languages: string[]
  last_air_date: string
  last_episode_to_air: object
  name: string
  next_episode_to_air: object
  networks: object[]
  number_of_episodes: number
  number_of_seasons: number
  origin_country: string[]
  original_language: string
  original_name: string
  overview: string
  popularity: number
  poster_path: string
  production_companies: object[]
  seasons: object[]
  spoken_languages: object[]
  status: string
  tagline: string
  type: string
  vote_average: number
  vote_count: number
}

export interface MovieProviders {
  id: number
  results: {
    [key: string]: {
      link: string
      rent: {
        logo_path: string
        provider_id: number
        provider_name: string
        display_priority: string
      }[]
      buy: {
        logo_path: string
        provider_id: number
        provider_name: string
        display_priority: string
      }[]
      flatrate: {
        logo_path: string
        provider_id: number
        provider_name: string
        display_priority: string
      }[]
    }
  }
}
