import { useEffect, useState } from 'react'
import { AuthorizationState, Logout } from '@/services/authorization_state'

interface AuthorizedViewProps {
  children: React.ReactNode
}

export function AuthorizedView({ children }: AuthorizedViewProps) {
  var authState = AuthorizationState()
  const [authorized, setAuthorized] = useState(authState !== null)

  useEffect(() => {
    const authState = AuthorizationState()
    let new_auth_state = authState !== null
    if (new_auth_state !== authorized) {
      setAuthorized(new_auth_state)
    }
  }, [authorized])

  return <>{authorized ? children : <></>}</>
}

export function NotAuthorizedView({ children }: AuthorizedViewProps) {
  var authState = AuthorizationState()
  const [authorized, setAuthorized] = useState(authState === null)

  useEffect(() => {
    const authState = AuthorizationState()
    let new_auth_state = authState === null
    if (new_auth_state != authorized) {
      setAuthorized(new_auth_state)
    }
  }, [authorized])

  return <>{authorized ? children : <></>}</>
}
