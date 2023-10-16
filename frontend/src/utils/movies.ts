import { TMDB_IMAGE_BASE_URL } from '@/config'

export const getMovieDuration = (duration: number): string => {
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60
  return `${hours} HR ${minutes} MIN`
}

export const getMovieYear = (date: string): string => date?.split('-')[0]

export const getMovieAge = (adult: boolean): string => (adult ? '18+' : '13+')

export const getMovieImageUrl = (path: string) => TMDB_IMAGE_BASE_URL + path

// Not used at the moment
export const formatGenre = (str: string) => {
  if (str.includes('%20')) {
    const words = str.split('%20')
    const formatted = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })

    return formatted.join('%20')
  }

  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const prettifyGenre = (str: string) => {
  if (str.includes('%20')) {
    const words = str.split('%20')
    const formatted = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })

    return formatted.join(' ')
  }

  return str.charAt(0).toUpperCase() + str.slice(1)
}
