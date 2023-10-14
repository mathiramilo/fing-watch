import { SERVER_API_URL } from '@/config'

export async function signIn(email: string, password: string) {
  const payload = {
    email,
    password
  }

  const url = SERVER_API_URL + '/auth/sign-in'

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }

  try {
    const res = await fetch(url, options)
    const data = await res.json()

    if (data.result && data.token != undefined && data.token != '') {
      localStorage.setItem('token', data.token)
      return data
    } else {
      throw new Error('An error occurred. Please try again.')
    }
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export async function signUp(email: string, password: string) {
  const payload = {
    email,
    password
  }

  const url = SERVER_API_URL + '/auth/sign-up'

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }

  try {
    const res = await fetch(url, options)
    const data = await res.json()

    if (data.result && data.token != undefined && data.token != '') {
      localStorage.setItem('token', data.token)
      return data
    } else {
      throw new Error('An error occurred. Please try again.')
    }
  } catch (error) {
    throw new Error((error as Error).message)
  }
}
