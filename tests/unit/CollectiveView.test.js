import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi, vitest } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '../../src/routes'
import { useCollectiveStore } from '../../src/stores/CollectiveStore'
import { useSessionStore } from '../../src/stores/SessionStore'
import CollectiveView from '../../src/views/CollectiveView.vue'


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

const collective = {
  name: 'jla',
  title: 'JLA',
  description: 'Justice League of America',
  creator: 'superman',
  permissions: {
    canEdit: false,
    canJoin: false
  }
}

describe('Test CollectiveView', () => {
  beforeEach(() => {
    collectiveStore.clear()
    sessionStore.clear()
    collectiveStore.addCollective(collective.name, collective.title, collective.description, collective.creator)
    collectiveStore.selectCollective(collective.name)
  }),
  it('show collective information', async () => {
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
    const description = wrapper.get('#collective-description')
    expect(description.isVisible()).toBe(true)
    expect(description.text()).toBe(collective.description)
  })
})
