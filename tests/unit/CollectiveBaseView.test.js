import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi, vitest } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '../../src/routes'
import { useCollectiveStore } from '../../src/stores/CollectiveStore'
import { useSessionStore } from '../../src/stores/SessionStore'
import CollectiveBaseView from '../../src/views/CollectiveBaseView.vue'


const pinia = createTestingPinia({
  createSpy: vitest.fn,
  stubActions: false
})

const router = createRouter({
  history: createWebHistory(), // Use browser built-in history
  routes: routes
})

vi.mock('axios')

const collectiveStore = useCollectiveStore()
const sessionStore = useSessionStore()


describe('Test CollectiveBaseView', () => {
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
    sessionStore.login('superman', 'abcd')
    const wrapper = mount(CollectiveBaseView, {
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
    expect(title.isVisible()).toBe(true)
    expect(description.isVisible()).toBe(true)
    expect(title.text()).toBe(collective.title)
    expect(description.text()).toBe(collective.description)
  }),
  it('show unknown if collective does not exist', () => {
    collectiveStore.clear()
    const wrapper = mount(CollectiveBaseView, {
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
