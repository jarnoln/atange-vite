import { userInfo } from 'os'
import { defineStore } from 'pinia'

export const useSessionStore = defineStore('SessionStore', {
    state: () => ({
        username: '',
        token: '',
        loginInProgress: false,  // True when login information sent to server but reply not received yet
        registerInProgress: false   // True when register information sent to server but reply not received yet
    }),
    getters: {
        isLogged: (state) => {
            return ((state.username.length > 0) && (state.token.length > 0))
        }
    },
    actions: {
        login(username: string, token: string) {
            this.username = username
            this.token = token
        }
    }
})
