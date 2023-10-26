import { ENV } from '@/config'
import { IMoviesListItem, ISearchResults, RecommenderTypes } from '@/types'

export const searchMovies = async (query: string, perPage = 10): Promise<IMoviesListItem[]> => {
  try {
    const url = ENV.SERVER_API_URL + `/movies?per_page=${perPage}&q=${query}`

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    }

    const res = await fetch(url, options)
    const data: ISearchResults = await res.json()

    const hits = data.hits.map((hit) => hit.document)

    return hits
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export const getRecommendedMovies = async (
  userId: string | number,
  type: RecommenderTypes,
  perPage = 10,
  genre: string | null = null
): Promise<IMoviesListItem[]> => {
  try {
    const url = ENV.SERVER_API_URL + `/recommend/${userId}/${type}${genre ? '/' + genre : ''}?n=${perPage}`

    const res = await fetch(url)
    const data = await res.json()

    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export const getPopularMovies = async (perPage = 10, genre: string | null = null): Promise<IMoviesListItem[]> => {
  try {
    const url = ENV.SERVER_API_URL + `/movies/popular${genre ? '/' + genre : ''}?n=${perPage}`

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    }

    const res = await fetch(url, options)
    const data = await res.json()

    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export const getLatestMovies = async (perPage = 10, genre: string | null = null): Promise<IMoviesListItem[]> => {
  try {
    const url = ENV.SERVER_API_URL + `/movies/latest${genre ? '/' + genre : ''}?n=${perPage}`

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    }

    const res = await fetch(url, options)
    const data = await res.json()

    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}
