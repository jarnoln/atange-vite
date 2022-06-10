import { nextTick } from 'vue'
import { render, fireEvent } from '@testing-library/vue'
import { beforeEach, describe, expect, it, test, vi, vitest } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '../../src/routes'
import { useCollectiveStore } from '../../src/stores/CollectiveStore'
import { useNotificationStore } from '../../src/stores/NotificationStore'
import { useSessionStore } from '../../src/stores/SessionStore'
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
const notificationStore = useNotificationStore()
const sessionStore = useSessionStore()

describe('Test CollectiveList', () => {
  beforeEach(() => {
    collectiveStore.clear()
    sessionStore.clear()
  }),
  it('shows collective titles', async () => {
    // The render method returns a collection of utilities to query your component.
    const { getByText } = render(CollectiveList, {
      global: {
        plugins: [router, pinia]
      }
    })
    expect(notificationStore.isLoadingCollectives).toBe(true)
    getByText('Loading...')
    await nextTick()
    expect(notificationStore.isLoadingCollectives).toBe(false)
    getByText('JLA')
  }),
  it('shows create button if logged in', async () => {
    const wrapper = mount(CollectiveList, {
      global: {
        plugins: [router, pinia]
      }
    })
    expect(notificationStore.isLoadingCollectives).toBe(true)
    await nextTick()
    expect(notificationStore.isLoadingCollectives).toBe(false)
    sessionStore.login('superman', 'abcd')
    await nextTick()
    const createButton = wrapper.get('#create-collective-button')
    expect(createButton.exists()).toBe(true)
    expect(createButton.text()).toBe('Create new')
  }),
  it('does not show create button if not logged in', async () => {
    const wrapper = mount(CollectiveList, {
      global: {
        plugins: [router, pinia]
      }
    })
    expect(notificationStore.isLoadingCollectives).toBe(true)
    await nextTick()
    expect(notificationStore.isLoadingCollectives).toBe(false)
    const createButton = wrapper.find('#create-collective-button')
    expect(createButton.exists()).toBe(false)
  })
})
