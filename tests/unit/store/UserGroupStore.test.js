import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it, vi, vitest } from 'vitest'
import { useUserGroupStore } from '../../../src/stores/UserGroupStore'

vi.mock('axios')

const pinia = createPinia()
setActivePinia(pinia)

const userGroupStore = useUserGroupStore()

const district_1 = {
  name: 'metropolis',
  title: 'Metropolis',
  type: 'district',
  collective: ''
}

const district_2 = {
  name: 'gotham',
  title: 'Gotham',
  type: 'district',
  collective: ''
}

const party_1 = {
  name: 'green_party',
  title: 'Green party',
  type: 'party',
  collective: ''
}

const election_1 = {
  name: 'leader_election',
  title: 'Leader election',
  type: 'election',
  collective: ''
}

describe('Test UserGroupStore', () => {
  beforeEach(() => {
    userGroupStore.clear()
  }),
  it('can store user groups', () => {
    expect(userGroupStore.count).toBe(0)
    expect(userGroupStore.districts.length).toBe(0)
    expect(userGroupStore.parties.length).toBe(0)
    expect(userGroupStore.elections.length).toBe(0)
    expect(userGroupStore.hasElections).toBe(false)
    expect(userGroupStore.addUserGroup(
      district_1.name,
      district_1.title,
      district_1.type,
      district_1.collective,
      )).toBe(true)
    expect(userGroupStore.userGroups.length).toBe(1)
    expect(userGroupStore.count).toBe(1)
    expect(userGroupStore.userGroups[0].name).toBe(district_1.name)
    expect(userGroupStore.userGroups[0].title).toBe(district_1.title)
    expect(userGroupStore.userGroups[0].type).toBe(district_1.type)
    expect(userGroupStore.userGroups[0].collective).toBe(district_1.collective)

    expect(userGroupStore.addUserGroup(
      district_2.name,
      district_2.title,
      district_2.type,
      district_2.collective,
      )).toBe(true)
    expect(userGroupStore.count).toBe(2)
    expect(userGroupStore.districts.length).toBe(2)
    expect(userGroupStore.parties.length).toBe(0)
    expect(userGroupStore.elections.length).toBe(0)

    expect(userGroupStore.addUserGroup(
      party_1.name,
      party_1.title,
      party_1.type,
      party_1.collective,
      )).toBe(true)
    expect(userGroupStore.count).toBe(3)
    expect(userGroupStore.districts.length).toBe(2)
    expect(userGroupStore.parties.length).toBe(1)
    expect(userGroupStore.elections.length).toBe(0)
    expect(userGroupStore.hasElections).toBe(false)

    expect(userGroupStore.addUserGroup(
      election_1.name,
      election_1.title,
      election_1.type,
      election_1.collective,
      )).toBe(true)
    expect(userGroupStore.count).toBe(4)
    expect(userGroupStore.districts.length).toBe(2)
    expect(userGroupStore.parties.length).toBe(1)
    expect(userGroupStore.elections.length).toBe(1)
    expect(userGroupStore.hasElections).toBe(true)
  }),
  it('does not store user groups with missing information', () => {
    expect(userGroupStore.count).toBe(0)
    expect(userGroupStore.addUserGroup(
      '',
      district_1.title,
      district_1.type,
      district_1.collective,
      )).toBe(false)
    expect(userGroupStore.count).toBe(0)
    expect(userGroupStore.addUserGroup(
      district_1.name,
      '',
      district_1.type,
      district_1.collective,
      )).toBe(false)
    expect(userGroupStore.count).toBe(0)
  }),
  it('can be cleared', () => {
    userGroupStore.addUserGroup(district_1.name, district_1.title, district_1.type, district_1.collective)
    userGroupStore.addUserGroup(district_2.name, district_2.title, district_2.type, district_2.collective)
    expect(userGroupStore.count).toBe(2) 
    userGroupStore.clear()
    expect(userGroupStore.count).toBe(0)
  })
})
