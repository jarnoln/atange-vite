import { defineStore } from 'pinia'
import { Collective, Permissions } from '../types'

export const useCollectiveStore = defineStore('CollectiveStore', {
  state: () => ({
    collectives: [] as Collective[],
    currentCollectiveName: '',
    admins: [] as string[]  // List of current collective administrator usernames
  }),
  getters: {
    count: (state) => state.collectives.length,
    collectiveNames: (state) => state.collectives.map(collective => collective.name),
    currentCollective: (state) => {
      if (state.currentCollectiveName === '')
      {
        return undefined
      }
      return state.collectives.find(collective => collective.name === state.currentCollectiveName)
    }
  },
  actions: {
    clear() {
      this.collectives = []
      this.currentCollectiveName = ''
      this.admins = []
    },
    addCollective(name: string, title: string, description: string, isVisible: boolean, creator: string) {
      console.log('CollectiveStore:addCollective', name, title, description, isVisible, creator)
      if (name.length < 1) {
        console.warn('addCollective: Name too short:', name)
        return false
      }
      if (title.length < 1) {
        console.warn('addCollective: Title too short:', title)
        return false
      }
      if (creator.length < 1) {
        console.warn('addCollective: Creator too short:', title)
        return false
      }
      this.collectives.push({
        name: name,
        title: title,
        description: description,
        creator: creator,
        isVisible: isVisible,
        permissions: {
          canEdit: false,
          canJoin: false
        }
      })
      return true
    },
    deleteCollective(collectiveName: string) {
      console.log('CollectiveStore:deleteCollective', collectiveName)
      // console.log('collectives before:', this.collectives)
      if (this.currentCollectiveName === collectiveName) {
        this.currentCollectiveName = ''  // Current index might not be correct after array modified
      }
      const index = this.collectives.findIndex(collective => collective.name === collectiveName)
      console.log(collectiveName, 'found at index', index)
      this.collectives = this.collectives.filter(collective => collective.name != collectiveName)
      // console.log('collectives after:', this.collectives)
    },
    updateCurrentCollective(title: string, description: string, isVisible: boolean) {
      console.log('updateCurrentCollective', title, description, isVisible)
      console.log('  collectives before:', this.collectives)
      const collective = this.currentCollective
      if (collective === undefined) {
        return false
      }
      collective.title = title
      collective.description = description
      collective.isVisible = isVisible
      console.log('  collectives after:', this.collectives)
    },
    selectCollective(name: string) : boolean {
      this.admins = []
      const index = this.collectives.findIndex(collective => collective.name === name)
      console.log('selectCollective(name=', name, ') index:', index)
      if (index > -1) {
        this.currentCollectiveName = name
        return true
      }
      this.currentCollectiveName = ''
      return false
    },
    updateCollectivePermissions(collectiveName: string, permissions: Permissions) {
      console.log('updateCollectivePermissions', collectiveName, permissions)
      if (permissions === undefined || permissions.canEdit === undefined || permissions.canJoin === undefined) {
        throw Error('updateCollectivePermissions: permissions not defined')
      }
      const index = this.collectives.findIndex(collective => collective.name === collectiveName)
      if (index > -1) {
        this.collectives[index].permissions.canEdit = permissions.canEdit
        this.collectives[index].permissions.canJoin = permissions.canJoin
        return true
      }
      console.warn('updateCollectivePermissions: Collective not found with name', collectiveName)
      return false
    },
    addAdmin(username: string) {
      console.log('addAdmin', username)
      this.admins.push(username)
    },
    kickAdmin(username: string) {
      console.log('CollectiveStore:kickAdmin', username)
      const index = this.admins.findIndex(admin => admin === username)
      if (index > -1) {
        this.admins = this.admins.filter(admin => admin != username)
        console.log(this.admins)
      } else {
        console.warn(username, 'is not is admins:', this.admins)
      }
    }
  }
})
