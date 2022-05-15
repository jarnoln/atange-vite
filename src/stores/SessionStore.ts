import { defineStore } from 'pinia'

export const useSessionStore = defineStore('SessionStore', {
  state: () => ({
    username: '',
    token: ''
  }),
  getters: {
    isLoggedIn: (state) => {
      return ((state.username.length > 0) && (state.token.length > 0))
    }
  },
  actions: {
    login(username: string, token: string) {
      console.log('SessionStore: login(', username, token, ')')
      this.username = username
      this.token = token
    },
    logout() {
      this.username = ''
      this.token = ''
    }
  }
})
