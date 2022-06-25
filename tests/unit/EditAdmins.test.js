import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, test, vi, vitest } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '../../src/routes'
import { useCollectiveStore } from '../../src/stores/CollectiveStore'
import { useSessionStore } from '../../src/stores/SessionStore'
import EditAdmins from '../../src/components/EditAdmins.vue'


const router = createRouter({
  history: createWebHistory(), // Use browser built-in history
  routes: routes
})

const pinia = createTestingPinia({
  createSpy: vitest.fn,
})

vi.mock('axios')

const collectiveStore = useCollectiveStore()
const sessionStore = useSessionStore()

describe('Test EditAdmins', () => {
  beforeEach(() => {
    collectiveStore.clear()
    sessionStore.clear()
    collectiveStore.addCollective('jsa', 'JSA', '', 'superman')
    collectiveStore.selectCollective('jsa')
  }),
  it('shows current admins', async () => {
    sessionStore.login('superman', 'abcd')
    collectiveStore.updateCollectivePermissions('jsa', { canEdit: true, canJoin: true })
    collectiveStore.admins = ['batman', 'superman']
    const wrapper = mount(EditAdmins, {
      global: {
        plugins: [router, pinia]
      }
    })
    expect(wrapper.text()).toContain('Admins')
    expect(wrapper.text()).toContain('batman')
    expect(wrapper.text()).toContain('superman')
    /* const collectiveNameInput = wrapper.get('#collective-name')
    const collectiveSubmitButton = wrapper.get('#collective-submit-button')
    expect(collectiveNameInput.isVisible()).toBe(true)
    expect(collectiveSubmitButton.isVisible()).toBe(true)
    expect(collectiveSubmitButton.attributes().disabled).toBe('true')
    expect(collectiveSubmitButton.text()).toBe('Create') */
  }),
  it('can add new admin', async () => {
    collectiveStore.updateCollectivePermissions('jsa', { canEdit: true, canJoin: true })
    /* sessionStore.login('superman', 'abcd')
    const wrapper = mount(EditCollective, {
      global: {
        plugins: [router, pinia]
      }
    }) */
  }),
  it('can remove admin', async () => {
    collectiveStore.updateCollectivePermissions('jsa', { canEdit: true, canJoin: true })
    /* sessionStore.login('superman', 'abcd')
    const wrapper = mount(EditAdmins, {
      global: {
        plugins: [router, pinia]
      }
    }) */
  }),
  it('does not show admins if not logged in', async () => {
    collectiveStore.admins = ['batman', 'superman']
    const wrapper = mount(EditAdmins, {
      global: {
        plugins: [router, pinia]
      }
    })
    expect(wrapper.text()).not.toContain('Admins')
    expect(wrapper.text()).not.toContain('batman')
    expect(wrapper.text()).not.toContain('superman')
  })
})
