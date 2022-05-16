import { beforeEach, describe, expect, it, vi, vitest } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { EventService } from '../../src/services/EventService.ts'
import { useCollectiveStore } from '../../src/stores/CollectiveStore'
import { useNotificationStore } from '../../src/stores/NotificationStore'
import { useSessionStore } from '../../src/stores/SessionStore'


vi.mock('axios', () => {
  return {
    default: {
      create(options) {
        return {
          get: (url) => {
            let dataOut = {}
            if (url === '/api/collectives/') {
              dataOut = [{ name: 'jla', title: 'JLA', description: '' }]
            }
            return new Promise((resolve, reject) => {
              resolve({
                status: 200,
                data: dataOut
              })
            })
          },
          post: (url, dataIn) => {
            let status = 201
            let dataOut = {}
            if (url === '/auth/token/login/') {
              dataOut = { auth_token: 'abcd' }
              status = 200
            } else if (url === '/auth/users/') {
              dataOut = { username: dataIn.username }
            }
            return new Promise((resolve, reject) => {
              resolve({
                status: status,
                data: dataOut
              })
            })
          },
          delete: (url) => {
            return new Promise((resolve, reject) => {
              resolve({
                status: 204
              })
            })
          }
        }
      }
    }
  }
})

createTestingPinia({
  createSpy: vitest.fn,
  stubActions: false
})

const collectiveStore = useCollectiveStore()
const sessionStore = useSessionStore()
const notificationStore = useNotificationStore()

beforeEach(() => {
  collectiveStore.clear()
  sessionStore.clear()
  notificationStore.clear()
})

describe('Test EventService:fetchCollectives', () => {
    it('calls fetch with proper URL', async () => {
        expect(collectiveStore.selectedCollective).toBe(undefined)
        expect(collectiveStore.collectives.length).toBe(0)
        await EventService.fetchCollectives()
        expect(collectiveStore.collectives.length).toBe(1)
        // expect(testFetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/collectives/')
    })
})


describe('Test EventService:login', () => {
  it('sets username and token', async () => {
    expect(sessionStore.username).toBe('')
    expect(sessionStore.token).toBe('')
    expect(notificationStore.count).toBe(0)
    await EventService.login('superman', 'manofsteel')
    expect(sessionStore.username).toBe('superman')
    expect(sessionStore.token).toBe('abcd')
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('logged_in')
  })
})

describe('Test EventService:register', () => {
  it('can register', async () => {
    expect(notificationStore.count).toBe(0)
    await EventService.register('superman', 'manofsteel')
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('registered')
  })
})

describe('Test EventService:logout', () => {
  it('resets username and token', async () => {
    await EventService.login('superman', 'manofsteel')
    expect(sessionStore.username).toBe('superman')
    expect(sessionStore.token).toBe('abcd')
    await EventService.logout()
    expect(sessionStore.username).toBe('')
    expect(sessionStore.token).toBe('')
  })
})

describe('Test EventService:createCollective', () => {
  it('creates collective', async () => {
    expect(collectiveStore.collectives.length).toBe(0)
    expect(notificationStore.count).toBe(0)
    await EventService.createCollective({name: 'jla', title:'JLA'})
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('collective_created')
    // expect(collectiveStore.collectives.length).toBe(1)
  })
})

describe('Test EventService:deleteCollective', () => {
  it('calls login with proper URL', async () => {
    expect(notificationStore.count).toBe(0)
    await EventService.deleteCollective({name: 'jla', title:'JLA'})
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('collective_deleted')
  })
})
