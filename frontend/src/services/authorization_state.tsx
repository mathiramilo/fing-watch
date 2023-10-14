import { useEffect, useState } from 'react'
import { SERVER_API_URL } from '@/config'

// Component to validate authorization in a page
// If not authorized, redirects to login
// Use the following way in the html returned component: <Authorize />
export function Authorize() {
  var [authState, setAuthState] = useState(AuthorizationState())
  console.log(authState)
  if (authState === null) {
    window.location.href = 'sign-in'
  }

  useEffect(() => {
    let state = AuthorizationState()
    if (authState !== state) {
      setAuthState(state)
    }
  }, [authState])

  return <></>
}

// Returns the authorization state of the user (or null if not authorized)
export function AuthorizationState(): User | null {
  let token = localStorage.getItem('token')
  // console.log(parseJwt(token))
  let authState = parseJwt(token)
  if (authState?.validity === undefined || authState?.validity < new Date()) {
    Logout()
    return null
  }
  return authState
}

export async function Login(email: string, password: string) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      password: password
    })
  }
  await fetch(`${SERVER_API_URL}/auth/sign-up`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      if (data.result && data.token != undefined && data.token != '') {
        localStorage.setItem('token', data.token)
      }
    })
}

export async function Register(email: string, password: string) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      password: password
    })
  }
  await fetch(`${SERVER_API_URL}/auth/sign-in`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      if (data.result && data.token != undefined && data.token != '') {
        localStorage.setItem('token', data.token)
      }
    })
}

export function Logout() {
  localStorage.removeItem('token')
}

// Parses the a jwt token
function parseJwt(token: string | null): User | null {
  if (token === null) {
    return null
  }
  var base64Url = token.split('.')[1]
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  var jsonPayload = decodeURIComponent(
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
