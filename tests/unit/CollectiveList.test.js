import { nextTick } from 'vue'
import { render, fireEvent } from '@testing-library/vue'
import { beforeEach, describe, expect, it, test, vi, vitest } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '../../src/routes'
import { useSessionStore } from '../../src/stores/SessionStore'
import { useCollectiveStore } from '../../src/stores/CollectiveStore'
import CollectiveList from '../../src/components/CollectiveList.vue'

vi.mock('axios')

const router = createRouter({
  history: createWebHistory(), // Use browser built-in history
  routes: routes
})

const pinia = createTestingPinia({
  createSpy: vitest.fn,
  stubActions: false
})

const collectiveStore = useCollectiveStore()
const sessionStore = useSessionStore()

describe('Test CollectiveList', () => {
  beforeEach(() => {
    collectiveStore.clear()
    sessionStore.clear()
  }),
  it('shows collective titles', async () => {
    // The render method returns a collection of utilities to query your component.
    collectiveStore.addCollective('jla', 'JLA', '', 'superman')
    collectiveStore.addCollective('jsa', 'JSA', '', 'flash')
    const { getByText } = render(CollectiveList, {
      global: {
        plugins: [router, pinia]
      }
    })
    getByText('JLA')
    getByText('JSA')
  }),
  it('shows create button if logged in', async () => {
    const wrapper = mount(CollectiveList, {
      global: {
        plugins: [router, pinia]
      }
    })
    sessionStore.login('superman', 'abcd')
    await nextTick()
    const createButton = wrapper.get('#create-collective-button')
    expect(createButton.exists()).toBe(true)
    expect(createButton.text()).toBe('Create new')
  }),
  it('shows create button if logged in', async () => {
    const wrapper = mount(CollectiveList, {
      global: {
        plugins: [router, pinia]
      }
    })
    sessionStore.login('superman', 'abcd')
    await nextTick()
    const createButton = wrapper.find('#create-collective-button')
    expect(createButton.exists()).toBe(true)
    expect(createButton.text()).toBe('Create new')
  }),
  it('does not show create button if not logged in', async () => {
    const wrapper = mount(CollectiveList, {
      global: {
        plugins: [router, pinia]
      }
    })
    await nextTick()
    const createButton = wrapper.find('#create-collective-button')
    expect(createButton.exists()).toBe(false)
  })
})
