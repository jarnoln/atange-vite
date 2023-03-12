import { defineStore } from 'pinia'

export const useSessionStore = defineStore('SessionStore', {
  state: () => ({
    username: '',
    token: '',
    firstName: '',
    lastName: '',
    email: '',
    isCandidate: false
  }),
  getters: {
    isLoggedIn: (state) => {
      return ((state.username.length > 0) && (state.token.length > 0))
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
