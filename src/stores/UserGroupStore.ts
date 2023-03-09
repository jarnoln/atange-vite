import { defineStore } from 'pinia'
import { UserGroup } from '../types'

export const useUserGroupStore = defineStore('UserGroupStore', {
  state: () => ({
    userGroups: [] as UserGroup[]
  }),
  getters: {
    count: (state) => state.userGroups.length,
    userGroupNames: (state) => state.userGroups.map(ug => ug.name),
  },
  actions: {
    clear() {
      this.userGroups = []
    },
    addUserGroup(name: string, title: string, type: string, collective: string) {
      console.log('UserGroupStore:addUserGroup', name, title, type, collective)
      if (name.length < 1) {
        console.warn('addUserGroup: Name too short:', name)
        return false
      }
      if (title.length < 1) {
        console.warn('addUserGroup: Title too short:', title)
        return false
      }
      this.userGroups.push({
        name: name,
        title: title,
        type: type,
        collective: collective
      })
      return true
    }
  }
})
