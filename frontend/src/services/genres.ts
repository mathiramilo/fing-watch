import { ENV } from '@/config'

export const getGenres = async () => {
  try {
    const url = ENV.SERVER_API_URL + '/genres'

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
