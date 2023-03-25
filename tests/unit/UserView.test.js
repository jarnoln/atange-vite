import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi, vitest } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '../../src/routes'
import { createTestingPinia } from '@pinia/testing'
import { createI18n } from 'vue-i18n'
import { useSessionStore } from '../../src/stores/SessionStore'
import UserView from '../../src/views/UserView.vue'
import en from '../../src/locales/en.json'

vi.mock('axios')

const router = createRouter({
  history: createWebHistory(), // Use browser built-in history
  routes: routes
})

const pinia = createTestingPinia({
  createSpy: vitest.fn,
  stubActions: false
})

const messages = {
  'en': en
}

const i18n = createI18n({
  locale: 'en',
  messages
})

const sessionStore = useSessionStore()


describe('Test UserView', () => {
  beforeEach(() => {
    sessionStore.clear()
  }),
  it('shows username and delete button if logged in', () => {
    sessionStore.login('superman', 'abcd')
    const wrapper = mount(UserView, {
      global: {
        plugins: [i18n, pinia, router]
      }
    })
    expect(wrapper.text()).toContain('superman')
    expect(wrapper.text()).toContain('Delete account')
  }),
  it('does not shows username or delete button if not logged in', () => {
    const wrapper = mount(UserView, {
      global: {
        plugins: [i18n, pinia, router],
      }
    })
    expect(wrapper.text()).not.toContain('superman')
    expect(wrapper.text()).not.toContain('Delete account')
  })
})
