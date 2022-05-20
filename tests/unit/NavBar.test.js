import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it, vi, vitest } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '../../src/routes'
import { useSessionStore } from '../../src/stores/SessionStore'
import NavBar from '../../src/components/NavBar.vue'

// vi.mock('axios')

const router = createRouter({
  history: createWebHistory(), // Use browser built-in history
  routes: routes
})

const pinia = createTestingPinia({
  createSpy: vitest.fn,
  stubActions: false
})

const sessionStore = useSessionStore()


describe('Test NavBar', () => {
  it('show login and register links when not logged in', async () => {
    const wrapper = mount(NavBar, {
      global: {
        plugins: [pinia, router]
      }
    })
    await nextTick()
    expect(wrapper.get('#navbar-home').text()).toBe('Home')
    const login = wrapper.get('#navbar-login')
    const register = wrapper.get('#navbar-register')
    expect(login.text()).toBe('Login')
    expect(register.text()).toBe('Register')
  })
  it('show username and logout link when logged in', async () => {
    const wrapper = mount(NavBar, {
      global: {
        plugins: [pinia, router]
      }
    })
    sessionStore.login('superman', 'abcd')
    await nextTick()
    expect(wrapper.get('#navbar-home').text()).toBe('Home')
    const username = wrapper.get('#navbar-username')
    const logout = wrapper.get('#navbar-logout')
    expect(username.text()).toBe('superman')
    expect(logout.text()).toBe('Logout')
  })
})
