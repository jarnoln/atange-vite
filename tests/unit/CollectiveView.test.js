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


describe('Test CollectiveView', () => {
  beforeEach(() => {
    collectiveStore.clear()
    sessionStore.clear()
    const collective = {
      name: 'jla',
      title: 'JLA',
      description: 'Justice League of America',
      creator: 'superman'
    }
    collectiveStore.addCollective(collective.name, collective.title, collective.description, collective.creator)
    collectiveStore.selectCollective(collective.name)
  }),
  it('shows "Edit collective"-button when logged in as creator', async () => {
    sessionStore.login('superman', 'abcd')
    const wrapper = mount(CollectiveView, {
      global: {
        plugins: [pinia, router]
      }
    })
    const editButton = wrapper.get('#edit-collective-button')
    expect(editButton.exists()).toBe(true)
    expect(editButton.text()).toBe("Edit JLA")
  }),
  it('does not show "Edit collective"-button if not logged in as creator', async () => {
    sessionStore.login('batman', 'abcd')
    const wrapper = mount(CollectiveView, {
      global: {
        plugins: [pinia, router]
      }
    })
    const editButton = wrapper.find('#edit-collective-button')
    expect(editButton.exists()).toBe(false)
  }),
  it('does not show "Edit collective"-button if not logged in', async () => {
    const wrapper = mount(CollectiveView, {
      global: {
        plugins: [pinia, router]
      }
    })
    const editButton = wrapper.find('#edit-collective-button')
    expect(editButton.exists()).toBe(false)
  })
})
