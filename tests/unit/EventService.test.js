import { assert, beforeEach, describe, expect, it, vi, vitest } from 'vitest'
import { EventService, outerFetchCollectives } from '../../src/services/EventService.ts'
import { createTestingPinia } from '@pinia/testing'
const collectivesResponseData = [
  { name: 'jla', title: 'JLA'}
]

/// Replace global fetch with mock version which returns some collective data
const testFetch = vi.fn((url, options) => {
  return new Promise((resolve, reject) => {
    const fetchResponse = {
      ok: true,
      json() {
        return new Promise((resolve, reject) => {
            resolve(collectivesResponseData)
        })
      }
    }
    resolve(fetchResponse)
  })
})

vi.stubGlobal('fetch', testFetch)

createTestingPinia({
  createSpy: vitest.fn,
})

describe('Test EventService:fetchCollectives', () => {
    it('calls fetch with proper URL', () => {
        console.log('EventService:', EventService)
        outerFetchCollectives()
        expect(testFetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/collectives/')
    })
})