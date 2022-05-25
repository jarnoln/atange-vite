import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi, vitest } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '../../src/routes'
import { useCollectiveStore } from '../../src/stores/CollectiveStore'
import CollectiveView from '../../src/views/CollectiveView.vue'
// import { EventService } from '../../src/services/EventService.ts'


const pinia = createTestingPinia({
  createSpy: vitest.fn,
  stubActions: false
})

const router = createRouter({
  history: createWebHistory(), // Use browser built-in history
  routes: routes
})

vi.mock('axios')
// vi.mock('EventService')


const collectiveStore = useCollectiveStore()


describe('Test CollectiveView', () => {
  it('show collective information', async () => {
    collectiveStore.clear()
    const collective = {
      name: 'jla',
      title: 'JLA',
      description: 'Justice League of America'
    }
    collectiveStore.addCollective(collective.name, collective.title, collective.description)
    expect(collectiveStore.collectives.length).toBe(1)
    expect(collectiveStore.currentCollective).toBe(undefined)
    const wrapper = mount(CollectiveView, {
      props: {
        collectiveName: collective.name
      },
      global: {
        plugins: [pinia, router]
      }
    })
    await nextTick()
    expect(collectiveStore.currentCollective).toEqual(collective)
    const title = wrapper.get('#collective-title')
    const description = wrapper.get('#collective-description')
    const deleteButton = wrapper.get('#delete-collective-btn')
    expect(title.isVisible()).toBe(true)
    expect(description.isVisible()).toBe(true)
    expect(deleteButton.isVisible()).toBe(true)
    expect(title.text()).toBe(collective.title)
    expect(description.text()).toBe(collective.description)
  }),
  it('can delete collective', async () => {
    collectiveStore.clear()
    const collective = {
      name: 'jla',
      title: 'JLA',
      description: 'Justice League of America'
    }
    collectiveStore.addCollective(collective.name, collective.title, collective.description)
    expect(collectiveStore.collectives.length).toBe(1)
    expect(collectiveStore.currentCollective).toBe(undefined)
    const wrapper = mount(CollectiveView, {
      props: {
        collectiveName: collective.name
      },
      global: {
        plugins: [pinia, router]
      }
    })
    await nextTick()
    expect(collectiveStore.currentCollective).toEqual(collective)
    const deleteButton = wrapper.get('#delete-collective-btn')
    // expect(submitButton.attributes().disabled).toBe('true')
    deleteButton.trigger('click')
    await nextTick()
    expect(collectiveStore.collectives.length).toBe(0)
    expect(collectiveStore.currentCollective).toBe(undefined)
    expect(wrapper.text()).toContain('Unknown collective')
  }),
  it('show unknown if collective does not exist', () => {
    const wrapper = mount(CollectiveView, {
      props: {
        collectiveName: 'outsiders'
      },
      global: {
        plugins: [pinia, router]
      }
    })
    expect(wrapper.text()).toContain('Unknown collective')
  })
})
