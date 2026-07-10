import { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore, isTokenExpired } from '../store/useAuthStore'

function ProtectedRoute({ allowedRoles }) {
  const { accessToken, isAuthenticated, user, clearAuth } = useAuthStore()
  const [popstateTrigger, setPopstateTrigger] = useState(0)

  useEffect(() => {
    const handlePopState = () => {
      setPopstateTrigger(prev => prev + 1)
    }
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const currentToken = localStorage.getItem('accessToken') || accessToken
  const isExpired = isTokenExpired(currentToken)

  if (!isAuthenticated || !currentToken || isExpired) {
    if (isAuthenticated || currentToken) {
      clearAuth()
    }
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && (!user || !user.roles.some(role => allowedRoles.includes(role)))) {
    return <Navigate to="/forbidden" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
