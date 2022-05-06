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
        addCollective(collective: Collective) {
            this.collectives.push(collective)
        },
        deleteCollective(collective: Collective) {
            const index = this.collectives.indexOf(collective)
            if (index > -1) {
                this.collectives.splice(index, 1)
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
                this.addCollective({ name: 'jla', title: 'JLA'})
                this.addCollective({ name: 'jsa', title: 'JSA'})
                this.addCollective({ name: 'section8', title: 'Section 8'})
            }
        }
    }
})
