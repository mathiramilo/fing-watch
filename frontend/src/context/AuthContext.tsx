import { createContext, useState, useEffect } from 'react'

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

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token') || 'null')

    if (token) {
      const user = parseJwt(token)
      setUser(user)
      setToken(token)
    }
  }, [])

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', JSON.stringify(token))
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  return <AuthContext.Provider value={{ user, setUser, token, setToken }}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }

// User class to use as authorization state
class User {
  id: string
  email: string
  validity: Date

  constructor(id: string, email: string, validity: number) {
    this.id = id
    this.email = email
    this.validity = new Date(validity * 1000)
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
