import { TMDB_IMAGE_BASE_URL } from '@/config'

export const getMovieDuration = (duration: number): string => {
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60
  return `${hours} HR ${minutes} MIN`
}

export const getMovieYear = (date: string): string => date?.split('-')[0]

export const getMovieAge = (adult: boolean): string => (adult ? '18+' : '13+')

export const getMovieImageUrl = (path: string) => TMDB_IMAGE_BASE_URL + path
