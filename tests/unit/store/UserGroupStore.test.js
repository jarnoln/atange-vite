import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it, vi, vitest } from 'vitest'
import { useUserGroupStore } from '../../../src/stores/UserGroupStore'

vi.mock('axios')

const pinia = createPinia()
setActivePinia(pinia)

const userGroupStore = useUserGroupStore()

const ug_1 = {
  name: 'metropolis',
  title: 'Metropolis',
  type: 'district',
  collective: ''
}

const ug_2 = {
  name: 'gotham',
  title: 'Gotham',
  type: 'district',
  collective: ''
}

describe('Test UserGroupStore', () => {
  beforeEach(() => {
    userGroupStore.clear()
  }),
  it('can store user groups', () => {
    expect(userGroupStore.count).toBe(0)
    expect(userGroupStore.addUserGroup(
      ug_1.name,
      ug_1.title,
      ug_1.type,
      ug_1.collective,
      )).toBe(true)
    expect(userGroupStore.userGroups.length).toBe(1)
    expect(userGroupStore.count).toBe(1)
    expect(userGroupStore.userGroups[0].name).toBe(ug_1.name)
    expect(userGroupStore.userGroups[0].title).toBe(ug_1.title)
    expect(userGroupStore.userGroups[0].type).toBe(ug_1.type)
    expect(userGroupStore.userGroups[0].collective).toBe(ug_1.collective)
    expect(userGroupStore.addUserGroup(
        ug_2.name,
        ug_2.title,
        ug_2.type,
        ug_2.collective,
        )).toBe(true)
    expect(userGroupStore.count).toBe(2)
  }),
  it('does not store user groups with missing information', () => {
    expect(userGroupStore.count).toBe(0)
    expect(userGroupStore.addUserGroup(
        '',
        ug_1.title,
        ug_1.type,
        ug_1.collective,
        )).toBe(false)
    expect(userGroupStore.count).toBe(0)
    expect(userGroupStore.addUserGroup(
        ug_1.name,
        '',
        ug_1.type,
        ug_1.collective,
        )).toBe(false)
    expect(userGroupStore.count).toBe(0)
  }),
  it('can be cleared', () => {
    userGroupStore.addUserGroup(ug_1.name, ug_1.title, ug_1.type, ug_1.collective)
    userGroupStore.addUserGroup(ug_2.name, ug_2.title, ug_2.type, ug_2.collective)
    expect(userGroupStore.count).toBe(2) 
    userGroupStore.clear()
    expect(userGroupStore.count).toBe(0)
  })
})
