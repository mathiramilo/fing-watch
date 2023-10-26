import { createContext, useState, useEffect } from 'react'

import { User } from '@/models/User'
import { parseJwt } from '@/utils/jwt'

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

  const getUser = async (token: string) => {
    const user = parseJwt(token)
    setUser(user)
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
      getUser(token)
    } else {
      localStorage.removeItem('token')
      setUser(null)
    }
  }, [token]) // eslint-disable-line react-hooks/exhaustive-deps

  return <AuthContext.Provider value={{ user, setUser, token, setToken }}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
