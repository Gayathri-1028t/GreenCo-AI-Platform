import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './useAuthStore'

describe('Zustand Auth Store Tests', () => {
  beforeEach(() => {
    // Reset state before every test
    useAuthStore.getState().clearAuth()
  })

  it('should initialize with empty auth values', () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.accessToken).toBeNull()
    expect(state.isAuthenticated).toBeFalsy()
  })

  it('should store credentials on login success', () => {
    const userMock = { id: 1, email: 'operator@steelcorp.com', roles: ['ROLE_MANUFACTURING_COMPANY'] }
    const tokenMock = 'mock-jwt-token-string'

    useAuthStore.getState().setAuth(userMock, tokenMock)

    const state = useAuthStore.getState()
    expect(state.user).toEqual(userMock)
    expect(state.accessToken).toBe(tokenMock)
    expect(state.isAuthenticated).toBeTruthy()
  })

  it('should clear credentials on logout success', () => {
    const userMock = { id: 1, email: 'operator@steelcorp.com' }
    useAuthStore.getState().setAuth(userMock, 'token')

    useAuthStore.getState().clearAuth()

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.accessToken).toBeNull()
    expect(state.isAuthenticated).toBeFalsy()
  })
})
