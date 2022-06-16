import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi, vitest } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '../../src/routes'
import { useSessionStore } from '../../src/stores/SessionStore'
import EditUserView from '../../src/views/EditUserView.vue'


vi.mock('axios')

const router = createRouter({
  history: createWebHistory(), // Use browser built-in history
  routes: routes
})

const pinia = createTestingPinia({
  createSpy: vitest.fn,
  stubActions: false
})

const sessionStore = useSessionStore()


describe('Test EditUserView', () => {
  beforeEach(() => {
    sessionStore.clear()
  }),
  it('shows edit fields and save button if logged in', () => {
    sessionStore.login('superman', 'abcd')
    const wrapper = mount(EditUserView, {
      global: {
        plugins: [pinia, router]
      }
    })
    expect(wrapper.text()).toContain('First name')
    expect(wrapper.text()).toContain('Last name')
    expect(wrapper.text()).toContain('Email')
    expect(wrapper.text()).toContain('Save')
  }),
  it('does not show edit fields or save button if not logged in', () => {
    const wrapper = mount(EditUserView, {
      global: {
        plugins: [pinia, router]
      }
    })
    expect(wrapper.text()).not.toContain('First name')
    expect(wrapper.text()).not.toContain('Last name')
    expect(wrapper.text()).not.toContain('Email')
    expect(wrapper.text()).not.toContain('Save')
  })
})
