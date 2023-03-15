import { defineStore } from 'pinia'
import { User } from '../types'

export const useUserStore = defineStore('UserStore', {
  state: () => ({
    users: [] as User[],
    loaded: false
  }),
  getters: {
    count: (state) => state.users.length,
    userNames: (state) => state.users.map(ug => ug.username),
  },
  actions: {
    clear() {
      this.users = []
      this.loaded = true
    },
    getUser(username: string) {
        return this.users.find(user => user.username === username)
    },
    addUser(username: string, firstName: string, lastName: string) {
      console.log('UserStore:addUser', username, firstName, lastName)
      if (username.length < 1) {
        console.warn('addUser: UserName too short:', username)
        return false
      }
      if (this.getUser(username) !== undefined) {
        console.warn('addUser: Username already exists:', username)
        return false
      }
      this.users.push({
        username: username,
        firstName: firstName,
        lastName: lastName
      })
      this.loaded = true
      return true
    }
  }
})
