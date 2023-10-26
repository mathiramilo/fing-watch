import { User } from '@/models/User'

export function parseJwt(token: string | null): User | null {
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
