import { describe, expect, it, vi, vitest } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { EventService } from '../../src/services/EventService.ts'
import { useCollectiveStore } from '../../src/stores/CollectiveStore'

const collectivesResponseData = [
  { name: 'jla', title: 'JLA'}
]

/// Replace global fetch with mock version which returns some collective data
const testFetch = vi.fn((url, options) => {
  return new Promise((resolve, reject) => {
    if (url.includes('/api/collectives/')) {
      resolve({
        ok: true,
        json() {
          return new Promise((resolve, reject) => {
              resolve(collectivesResponseData)
          })
        }
      })
    } else if (url.includes('/api/collective/jla/')) {
      resolve({
        status: 200,
        json() {
          return new Promise((resolve, reject) => {
              resolve({})
          })
        }
      })
    } else if (url.includes('/auth/')) {
      resolve({
        status: 200,
        json() {
          return new Promise((resolve, reject) => {
              resolve({
                auth_token: 'abcd'
              })
          })
        }
      })
    } else {
      resolve({
        status: 500
      })
    }
  })
})

vi.stubGlobal('fetch', testFetch)

createTestingPinia({
  createSpy: vitest.fn
  // stubActions: false
})

describe('Test EventService:fetchCollectives', () => {
    it('calls fetch with proper URL', async () => {
        const store = useCollectiveStore()
        expect(store.selectedCollective).toBe(undefined)
        expect(store.collectives.length).toBe(0)
        await EventService.fetchCollectives()
        expect(testFetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/collectives/')
    })
})


describe('Test EventService:login', () => {
  it('calls login with proper URL', async () => {
      await EventService.login('superman', 'manofsteel')
  })
})

describe('Test EventService:register', () => {
  it('calls login with proper URL', async () => {
      await EventService.register('superman', 'manofsteel')
  })
})

describe('Test EventService:logout', () => {
  it('calls login with proper URL', async () => {
      await EventService.logout()
  })
})

describe('Test EventService:createCollective', () => {
  it('calls login with proper URL', async () => {
      await EventService.createCollective({name: 'jla', title:'JLA'})
  })
})

describe('Test EventService:deleteCollective', () => {
  it('calls login with proper URL', async () => {
      await EventService.deleteCollective({name: 'jla', title:'JLA'})
  })
})
