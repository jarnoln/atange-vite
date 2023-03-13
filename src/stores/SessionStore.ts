import { defineStore } from 'pinia'
import { UserGroup } from '../types'

export const useSessionStore = defineStore('SessionStore', {
  state: () => ({
    username: '',
    token: '',
    firstName: '',
    lastName: '',
    email: '',
    memberships: [] as UserGroup[],
  }),
  getters: {
    isLoggedIn: (state) => {
      return ((state.username.length > 0) && (state.token.length > 0))
    },
    isCandidate: (state) => {
      return state.memberships.find(ug => ug.type === 'election') !== undefined
    },
    party: (state) => {
      return state.memberships.find(ug => ug.type === 'party')
    },
    district: (state) => {
      return state.memberships.find(ug => ug.type === 'district')
    }
  },
  actions: {
    clear() {
      this.username = '',
      this.token = '',
      localStorage.removeItem('username')
      localStorage.removeItem('token')
    },
    login(username: string, token: string) {
      console.log('SessionStore: login(', username, token, ')')
      this.username = username
      this.token = token
      localStorage.setItem('username', username)
      localStorage.setItem('token', token)
    },
    logout() {
      this.clear()
    }
  }
})
