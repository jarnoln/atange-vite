import { describe, expect, it, vi, vitest } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { EventService } from '../../src/services/EventService.ts'
import { useCollectiveStore } from '../../src/stores/CollectiveStore'


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
          post: (url, data) => {
            let status = 201
            let dataOut = {}
            if (url === '/auth/token/login/') {
              dataOut = { auth_token: 'abcd' }
              status = 200
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
  createSpy: vitest.fn
  // stubActions: false
})

describe('Test EventService:fetchCollectives', () => {
    it('calls fetch with proper URL', async () => {
        const store = useCollectiveStore()
        expect(store.selectedCollective).toBe(undefined)
        expect(store.collectives.length).toBe(0)
        await EventService.fetchCollectives()
        // expect(testFetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/collectives/')
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
