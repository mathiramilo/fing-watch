import { createContext, useState, useEffect } from 'react'

import { ENV } from '@/config'

interface AuthProviderProps {
  children: React.ReactNode
}

export interface IAuthContext {
  user: User | null
  setUser: (user: User | null) => void
  token: string | null
  setToken: (token: string | null) => void
}

const initialValue = {
  user: null,
  setUser: () => {},
  token: null,
  setToken: () => {}
}

const AuthContext = createContext<IAuthContext>(initialValue)

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  const getWatchlist = async (id: string) => {
    const url = ENV.SERVER_API_URL + `/users/${id}/watchlist`

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    }

    const res = await fetch(url, options)
    const data = await res.json()

    if (data.result) {
      return data.watchlist
    }
  }

  const getUser = async (token: string) => {
    const user = parseJwt(token)
    const watchlist = await getWatchlist(user?.id!)

    return { ...user, watchlist } as User
  }

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token') || 'null')
    if (token) {
      setToken(token)
    }
  }, [])

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', JSON.stringify(token))
      getUser(token).then((user) => {
        setUser(user)
      })
    } else {
      localStorage.removeItem('token')
      setUser(null)
    }
  }, [token]) // eslint-disable-line react-hooks/exhaustive-deps

  return <AuthContext.Provider value={{ user, setUser, token, setToken }}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }

// User class to use as authorization state
export class User {
  id: string
  email: string
  validity: Date
  watchlist: string[]

  constructor(id: string, email: string, validity: number) {
    this.id = id
    this.email = email
    this.validity = new Date(validity * 1000)
    this.watchlist = []
  }
}

// Parses the a jwt token
function parseJwt(token: string | null): User | null {
  if (token === null) {
    return null
  }
  let base64Url = token.split('.')[1]
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  let jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )
  let jsonData = JSON.parse(jsonPayload)
  // console.log(jsonData)
  return new User(jsonData.userid, jsonData.email, jsonData.exp)
}
