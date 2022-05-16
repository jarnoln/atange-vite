import { defineStore } from 'pinia'
import { Collective } from '../types'

export const useCollectiveStore = defineStore('CollectiveStore', {
    state: () => ({
        collectives: [] as Collective[],
        selectedCollective: undefined as Collective | undefined
    }),
    getters: {
        getCollectiveByName: (state) => {
            return (collectiveName: string) => {
                state.collectives.find((collective) => collective.name === collectiveName)
            }
        },
        getCollectiveNames: (state) => {
            return state.collectives.map(collective => collective.name)
        }
    },
    actions: {
        clear() {
            this.collectives = []
            this.selectedCollective = undefined
        },
        addCollective(collective: Collective) {
            // console.log('CollectiveStore:addCollective', collective)
            this.collectives.push(collective)
        },
        deleteCollective(collectiveName: string) {
            console.log('CollectiveStore:deleteCollective', collectiveName)
            if (this.selectedCollective) {
                if (collectiveName === this.selectedCollective.name) {
                    this.selectedCollective = undefined
                }
            }
            const index = this.collectives.findIndex(collective => collective.name = collectiveName)
            if (index > -1) {
                this.collectives.splice(index, 1)
            } else {
                console.log('CollectiveStore:deleteCollective(', collectiveName, '): no such collective')
            }
        },
        selectCollective(name: string) {
            console.log('selectCollective(name=', name, ')')
            let result = this.collectives.find(collective => collective.name === name)
            console.log('result: ', result)
            if (result !== undefined) {
                this.selectedCollective = result
                return true
            }
            return false
        },
        addExampleCollectives() {
            if (this.collectives.length === 0) {
                this.addCollective({ name: 'jla', title: 'JLA', description: 'Justice League of America'})
                this.addCollective({ name: 'jsa', title: 'JSA', description: ''})
                this.addCollective({ name: 'section8', title: 'Section 8', description: ''})
            }
        }
    }
})
