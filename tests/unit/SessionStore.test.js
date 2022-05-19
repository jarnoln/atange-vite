import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSessionStore } from '../../src/stores/SessionStore'

const pinia = createPinia()
setActivePinia(pinia)

const sessionStore = useSessionStore()

describe('Test SessionStore', () => {
  beforeEach(() => {
    sessionStore.clear()
  }),
  it('can login', () => {
    expect(sessionStore.username).toBe('')
    expect(sessionStore.token).toBe('')
    expect(sessionStore.isLoggedIn).toBe(false)
    sessionStore.login('superman', 'abcd')
    expect(sessionStore.username).toBe('superman')
    expect(sessionStore.token).toBe('abcd')
    expect(sessionStore.isLoggedIn).toBe(true)
  }),
  it('can logout', () => {
    sessionStore.login('superman', 'abcd')
    expect(sessionStore.username).toBe('superman')
    expect(sessionStore.token).toBe('abcd')
    expect(sessionStore.isLoggedIn).toBe(true)
    sessionStore.logout()
    expect(sessionStore.username).toBe('')
    expect(sessionStore.token).toBe('')
    expect(sessionStore.isLoggedIn).toBe(false)
  })
})
