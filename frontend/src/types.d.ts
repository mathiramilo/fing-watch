export interface IMoviesListItem {
  adult: boolean
  backdrop_path: string
  genres: IGenres[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  runtime: number
  status: string
  tagline: string
  title: string
  vote_average: number
  vote_count: number
}

export interface IMovieDetails {
  adult: boolean
  backdrop_path: string
  genres: IGenres[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  production_companies: object[]
  release_date: string
  runtime: number
  status: string
  tagline: string
  title: string
  vote_average: number
  vote_count: number
  watch_providers: IMovieProviders
}

export interface ISeriesListItem {
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

export interface ISeriesDetails {
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

export interface IMovieProviders {
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

export interface ISearchResults {
  facet_counts: Array
  found: number
  hits: ISearchResultsHit[]
  out_of: number
  page: number
  request_params: object
  search_cutoff: boolean
  search_time_ms: number
}

export interface ISearchResultsHit {
  document: IMoviesListItem
  highlight: {
    title: {
      matched_tokens: string[]
      snippet: string
    }
  }
  highlights: Array
  text_match: number
  text_match_info: object
}

export interface IGenre {
  id: number
  name: string
}

export enum FeedbackTypes {
  Watchlist = 'watchlist',
  Like = 'like',
  Dislike = 'dislike'
}

export enum RecommenderTypes {
  Final = 'final',
  Collaborative = 'collaborative',
  UserBased = 'user_based',
  ItemBased = 'item_based'
}
