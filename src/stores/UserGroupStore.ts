import { defineStore } from 'pinia'
import { UserGroup, Candidate } from '../types'

export const useUserGroupStore = defineStore('UserGroupStore', {
  state: () => ({
    userGroups: [] as UserGroup[],
    candidates: [] as Candidate[],
    loaded: false
  }),
  getters: {
    count: (state) => state.userGroups.length,
    userGroupNames: (state) => state.userGroups.map(ug => ug.name),
    hasElections: (state) => state.userGroups.some(ug => ug.type === 'election'),
    elections: (state) => state.userGroups.filter(ug => ug.type === 'election'),
    districts: (state) => state.userGroups.filter(ug => ug.type === 'district'),
    parties: (state) => state.userGroups.filter(ug => ug.type === 'party'),
  },
  actions: {
    clear() {
      this.userGroups = []
      this.candidates = []
      this.loaded = true
    },
    clearCandidates() {
      this.candidates = []
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
        collective: collective,
        members: []
      })
      this.loaded = true
      return true
    },
    setUserGroupMembers(userGroupName: string, members: string[]) {
      const index = this.userGroups.findIndex(ug => ug.name === userGroupName)
      if (index !== -1) {
        this.userGroups[index].members = members
        console.log('usergroup', userGroupName, 'members set to', members)
      }
    },
    addCandidate(username: string, firstName: string, lastName: string) {
      this.candidates.push({
        username: username,
        firstName: firstName,
        lastName: lastName,
        party: null,
        district: null,
        answers: []
      })
    },
    getElectionName() {
      // Assuming there is at most one election
      if (this.elections.length === 1) {
        return this.elections[0].name
      }
      return ''
    },
    getElectionTitle() {
      // Assuming there is at most one election
      if (this.elections.length === 1) {
        return this.elections[0].title
      }
      return ''
    }
  }
})
