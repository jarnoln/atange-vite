import { defineStore } from 'pinia'
import { Collective, Permissions } from '../types'

export const useCollectiveStore = defineStore('CollectiveStore', {
  state: () => ({
    collectives: [] as Collective[],
    currentCollectiveName: '',
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
    },
    addCollective(name: string, title: string, description: string, creator: string) {
      console.log('CollectiveStore:addCollective', name, title, description, creator)
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
    updateCurrentCollective(title: string, description: string) {
      console.log('updateCurrentCollective', title, description)
      console.log('  collectives before:', this.collectives)
      const collective = this.currentCollective
      if (collective === undefined) {
        return false
      }
      collective.title = title
      collective.description = description
      console.log('  collectives after:', this.collectives)
    },
    selectCollective(name: string) : boolean {
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
    }
  }
})
