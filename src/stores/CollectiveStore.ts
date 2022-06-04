import { defineStore } from 'pinia'
import { Collective } from '../types'

export const useCollectiveStore = defineStore('CollectiveStore', {
  state: () => ({
    collectives: [] as Collective[],
    currentCollectiveName: '',
  }),
  getters: {
    count: (state) => state.collectives.length,
    collectiveNames: (state) => state.collectives.map(collective => collective.name),
    currentCollective: (state) => {
      if (state.currentCollectiveName === '') {
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
      // console.log('CollectiveStore:addCollective', collective)
      if (name.length < 1) {
        console.warn('addCollective: Name too short:', name)
      }
      if (title.length < 1) {
        console.warn('addCollective: Title too short:', title)
      }
      this.collectives.push({ name: name, title: title, description: description, creator})
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
    }
  }
})
