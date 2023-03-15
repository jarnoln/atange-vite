import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it, vi, vitest } from 'vitest'
import { useUserStore } from '../../../src/stores/UserStore'

vi.mock('axios')

const pinia = createPinia()
setActivePinia(pinia)

const userStore = useUserStore()

const user_1 = {
  username: 'superman',
  firstName: 'Clark',
  lastName: 'Kent'
}

const user_2 = {
  username: 'batman',
  firstName: 'Bruce',
  lastName: 'Wayne'
}
  

describe('Test UserStore', () => {
  beforeEach(() => {
    userStore.clear()
  }),
  it('can store user groups', () => {
    expect(userStore.count).toBe(0)
    expect(userStore.addUser(
      user_1.username,
      user_1.firstName,
      user_1.lastName
      )).toBe(true)
    expect(userStore.users.length).toBe(1)
    expect(userStore.count).toBe(1)

    expect(userStore.addUser(
      user_2.username,
      user_2.firstName,
      user_2.lastName,
      )).toBe(true)
    expect(userStore.count).toBe(2)
  }),
  it('does not store users with missing information', () => {
    expect(userStore.count).toBe(0)
    expect(userStore.addUser(
      '',
      user_1.firstName,
      user_1.lastName,
      )).toBe(false)
    expect(userStore.count).toBe(0)
  }),
  it('can be cleared', () => {
    userStore.addUser(user_1.username, user_1.firstName, user_1.lastName)
    userStore.addUser(user_2.username, user_2.firstName, user_2.lastName)
    expect(userStore.count).toBe(2) 
    userStore.clear()
    expect(userStore.count).toBe(0)
  })
})
