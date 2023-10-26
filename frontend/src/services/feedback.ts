import { ENV } from '@/config'
import { FeedbackTypes } from '@/types'

export const addFeedback = async (userId: string | number, movieId: string | number, type: FeedbackTypes) => {
  try {
    const url = ENV.SERVER_API_URL + `/feedback/${userId}/${movieId}/${type}`
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const res = await fetch(url, options)
    const data = await res.json()

    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export const removeFeedback = async (userId: string | number, movieId: string | number, type: FeedbackTypes) => {
  try {
    const url = ENV.SERVER_API_URL + `/feedback/${type}/${userId}/${movieId}`
    const options = {
      method: 'DELETE'
    }

    const res = await fetch(url, options)
    const data = await res.json()

    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export const getMovieFeedback = async (userId: string | number, movieId: string | number) => {
  try {
    const url = ENV.SERVER_API_URL + `/feedback/${userId}/${movieId}`

    const res = await fetch(url)
    const data = await res.json()

    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export const getUserFeedback = async (userId: string | number) => {
  try {
    const url = ENV.SERVER_API_URL + `/feedback/${userId}`

    const res = await fetch(url)
    const data = await res.json()

    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}
