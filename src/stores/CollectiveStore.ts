import { defineStore } from 'pinia'
import { Collective } from '../types'

export const useCollectiveStore = defineStore('CollectiveStore', {
    state: () => ({
        collectives: [] as Collective[]
    }),
    actions: {
        addCollective(collective: Collective) {
            this.collectives.push(collective)
        },
        deleteCollective(collective: Collective) {
            const index = this.collectives.indexOf(collective)
            if (index > -1) {
                this.collectives.splice(index, 1)
            }
        }
    }
})
