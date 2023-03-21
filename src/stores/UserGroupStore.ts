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
      this.loaded = false
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
      // Check if candidate is member of any party
      const party = this.parties.find(party => {
        return party.members.find(member => member === username) !== undefined ? true : false
      })
      console.log('Party for candidate', username, ':', party)
      // Check if candidate is member of any district
      const district = this.districts.find(district => {
        return district.members.find(member => member === username) !== undefined ? true : false
      })
      console.log('District for candidate', username, ':', district)
      this.candidates.push({
        username: username,
        firstName: firstName,
        lastName: lastName,
        party: party === undefined ? null : party,
        district: district === undefined ? null : district,
        candidateNumber: 0,
        homepage: '',
        description: '',
        answers: []
      })
    },
    getCandidate(username: string) {
      console.log('UserGroupStore:getCandidate', username)
      const candidate = this.candidates.find(candidate => candidate.username === username)
      console.log('Found:', candidate)
      if (candidate === undefined) {
        return undefined
      } else {
        return candidate
        // return { ...candidate }  // Return copy of candidate. This should not be used to alter questions.
      }
    },
    getEmptyCandidate() {
      const candidate : Candidate = {
        username: '',
        firstName: '',
        lastName: '',
        party: null,
        district: null,
        candidateNumber: 0,
        homepage: '',
        description: '',
        answers: []
      }
      return candidate
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
