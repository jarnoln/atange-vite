import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it, vi, vitest } from 'vitest'
import { useCollectiveStore } from '../../../src/stores/CollectiveStore'

vi.mock('axios')

const pinia = createPinia()
setActivePinia(pinia)

const collectiveStore = useCollectiveStore()

const collective_1 = {
  name: 'jla',
  title: 'JLA',
  description: 'Justice League of America'
}

const collective_2 = {
  name: 'jsa',
  title: 'JSA',
  description: 'Justice Society of America'
}

describe('Test CollectiveStore', () => {
  beforeEach(() => {
    collectiveStore.clear()
  }),
  it('can store collectives', () => {
    collectiveStore.addCollective(collective_1.name, collective_1.title, collective_1.description)
    expect(collectiveStore.collectives.length).toBe(1)
    expect(collectiveStore.count).toBe(1)
    collectiveStore.addCollective(collective_2.name, collective_2.title, collective_2.description)
    expect(collectiveStore.collectives.length).toBe(2)
    expect(collectiveStore.count).toBe(2)
  }),
  it('can select active collective', () => {
    collectiveStore.addCollective(collective_1.name, collective_1.title, collective_1.description)
    collectiveStore.addCollective(collective_2.name, collective_2.title, collective_2.description)
    expect(collectiveStore.collectives.length).toBe(2)
    expect(collectiveStore.currentCollective).toBe(undefined)
    collectiveStore.selectCollective(collective_2.name)
    expect(collectiveStore.currentCollective).toEqual(collective_2)
    collectiveStore.selectCollective(collective_1.name)
    expect(collectiveStore.currentCollective).toEqual(collective_1)
  }),
  it('can update current collective', () => {
    collectiveStore.addCollective(collective_1.name, collective_1.title, collective_1.description)
    collectiveStore.addCollective(collective_2.name, collective_2.title, collective_2.description)
    collectiveStore.selectCollective(collective_2.name)
    expect(collectiveStore.currentCollective).toEqual(collective_2)
    collectiveStore.updateCurrentCollective('Section 8', '')
    expect(collectiveStore.currentCollective.name).toEqual(collective_2.name)
    expect(collectiveStore.currentCollective.title).toEqual('Section 8')
    expect(collectiveStore.currentCollective.description).toEqual('')
  }),
  it('can delete collectives', () => {
    collectiveStore.addCollective(collective_1.name, collective_1.title, collective_1.description)
    collectiveStore.addCollective(collective_2.name, collective_2.title, collective_2.description)
    collectiveStore.selectCollective(collective_1.name)
    expect(collectiveStore.collectives.length).toBe(2)
    expect(collectiveStore.currentCollective).toEqual(collective_1)
    collectiveStore.deleteCollective(collective_1.name)
    expect(collectiveStore.collectives.length).toBe(1)
    expect(collectiveStore.currentCollective).toEqual(undefined)
    collectiveStore.deleteCollective(collective_2.name)
    expect(collectiveStore.collectives.length).toBe(0)
  }),
  it('try to delete unknown collective', () => {
    collectiveStore.addCollective(collective_1.name, collective_1.title, collective_1.description)
    expect(collectiveStore.collectives.length).toBe(1)
    collectiveStore.deleteCollective('unknown')
    expect(collectiveStore.collectives.length).toBe(1)
    collectiveStore.deleteCollective(collective_1.name)
    expect(collectiveStore.collectives.length).toBe(0)
  }),
  it('can get collective names', () => {
    expect(collectiveStore.collectiveNames).toEqual([])
    collectiveStore.addCollective(collective_1.name, collective_1.title, collective_1.description)
    collectiveStore.addCollective(collective_2.name, collective_2.title, collective_2.description)
    expect(collectiveStore.collectiveNames).toEqual(['jla', 'jsa'])
  }),
  it('can be cleared', () => {
    collectiveStore.addCollective(collective_1.name, collective_1.title, collective_1.description)
    collectiveStore.addCollective(collective_2.name, collective_2.title, collective_2.description)
    collectiveStore.selectCollective(collective_2.name)
    expect(collectiveStore.collectives.length).toBe(2)
    expect(collectiveStore.currentCollective).toEqual(collective_2)
    collectiveStore.clear()
    expect(collectiveStore.collectives.length).toBe(0)
    expect(collectiveStore.currentCollective).toBe(undefined)
  })
})
