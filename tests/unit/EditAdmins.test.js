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
    collectiveStore.addCollective('jsa', 'JSA', '', true, 'superman')
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
    const usernameInput = wrapper.get('#admin-username')
    const addAdminButton = wrapper.get('#add-admin-button')
    expect(usernameInput.isVisible()).toBe(true)
    expect(addAdminButton.isVisible()).toBe(true)
    expect(addAdminButton.attributes().disabled).toBe('true')
  }),
  it('can add new admin', async () => {
    sessionStore.login('superman', 'abcd')
    collectiveStore.updateCollectivePermissions('jsa', { canEdit: true, canJoin: true })
    collectiveStore.admins = ['superman']
    expect(collectiveStore.admins.length).toBe(1)
    const wrapper = mount(EditAdmins, {
      global: {
        plugins: [router, pinia]
      }
    })
    const usernameInput = wrapper.get('#admin-username')
    const addAdminButton = wrapper.get('#add-admin-button')
    usernameInput.setValue('aquaman')
    addAdminButton.trigger('click')
    // await nextTick()
    // expect(collectiveStore.admins.length).toBe(2)
  }),
  it('can remove admin', async () => {
    collectiveStore.updateCollectivePermissions('jsa', { canEdit: true, canJoin: true })
    collectiveStore.admins = ['aquaman', 'superman']
    sessionStore.login('superman', 'abcd')
    const wrapper = mount(EditAdmins, {
      global: {
        plugins: [router, pinia]
      }
    })
    const kickAquamanButton = wrapper.get('#btn-kick-aquaman')
    const kickSupermanButton = wrapper.get('#btn-kick-superman')
    expect(kickAquamanButton.isVisible()).toBe(true)
    expect(kickSupermanButton.isVisible()).toBe(true)
    expect(collectiveStore.admins.length).toBe(2)
    await kickAquamanButton.trigger('click')
    await nextTick()
    expect(collectiveStore.admins.length).toBe(1)
    expect(collectiveStore.admins[0]).toBe('superman')
    await kickSupermanButton.trigger('click')
    await nextTick()
    expect(collectiveStore.admins.length).toBe(0)
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
