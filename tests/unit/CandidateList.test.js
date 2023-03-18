import { nextTick } from 'vue'
import { render, fireEvent } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi, vitest } from 'vitest'
// import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '../../src/routes'
// import { useCollectiveStore } from '../../src/stores/CollectiveStore'
// import { useNotificationStore } from '../../src/stores/NotificationStore'
import { useUserGroupStore } from '../../src/stores/UserGroupStore'
import { useSessionStore } from '../../src/stores/SessionStore'
import CandidateList from '../../src/components/CandidateList.vue'

vi.mock('axios')

const router = createRouter({
  history: createWebHistory(), // Use browser built-in history
  routes: routes
})

const pinia = createTestingPinia({
  createSpy: vitest.fn,
  stubActions: false
})

// const collectiveStore = useCollectiveStore()
// const notificationStore = useNotificationStore()
const sessionStore = useSessionStore()
const userGroupStore = useUserGroupStore()


describe('Test CandidateList', () => {
  beforeEach(() => {
    userGroupStore.clear()
    sessionStore.clear()
  }),
  it('shows candidates title', async () => {
    const { getByText } = render(CandidateList, {
      global: {
        plugins: [router, pinia]
      }
    })
    await nextTick()
    userGroupStore.addUserGroup('leader_election', 'Leader election', 'election', '')
    userGroupStore.addCandidate('superman', 'Clark', 'Kent')
    expect(userGroupStore.candidates.length).toBe(1)
    await nextTick()
    getByText('Candidates')
    getByText('Clark Kent')
  })
})
