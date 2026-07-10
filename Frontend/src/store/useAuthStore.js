import { create } from 'zustand'

export function isTokenExpired(token) {
  if (!token) return true
  try {
    const parts = token.split('.')
    if (parts.length < 2) return true
    const payload = JSON.parse(atob(parts[1]))
    if (!payload.exp) return false
    return payload.exp * 1000 < Date.now()
  } catch (error) {
    return true
  }
}

export const useAuthStore = create((set) => {
  const savedToken = localStorage.getItem('accessToken')
  let savedUser = null
  try {
    savedUser = JSON.parse(localStorage.getItem('user'))
  } catch (e) {
    localStorage.removeItem('user')
  }

  const isExpired = isTokenExpired(savedToken)
  const isValid = !!savedToken && !isExpired

  if (savedToken && isExpired) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  }

  return {
    user: isValid ? savedUser : null,
    accessToken: isValid ? savedToken : null,
    isAuthenticated: isValid,
    
    setAuth: (user, accessToken) => {
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('accessToken', accessToken)
      set({
        user,
        accessToken,
        isAuthenticated: true
      })
    },
    
    clearAuth: () => {
      localStorage.removeItem('user')
      localStorage.removeItem('accessToken')
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false
      })
    }
  }
})
