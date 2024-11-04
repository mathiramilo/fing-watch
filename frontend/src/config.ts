// URLs
// export const TMDB_IMAGE_BASE_URL = 'http://localhost/movies'
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original/' // TMDB images base url
export const TMDB_API_URL = 'https://api.themoviedb.org/3' // TMDB API base url

// Environment variables
export const ENV = {
  SERVER_API_URL: process.env.NEXT_PUBLIC_SERVER_API_URL,
  TMDB_API_KEY: process.env.NEXT_PUBLIC_TMDB_API_KEY
}
