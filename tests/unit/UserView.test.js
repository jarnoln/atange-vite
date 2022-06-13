import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vitest } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { useSessionStore } from '../../src/stores/SessionStore'
import UserView from '../../src/views/UserView.vue'


const pinia = createTestingPinia({
  createSpy: vitest.fn,
  stubActions: false
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
        plugins: [pinia]
      }
    })
    expect(wrapper.text()).toContain('superman')
    expect(wrapper.text()).toContain('Delete account')
  }),
  it('does not shows username or delete button if not logged in', () => {
    const wrapper = mount(UserView, {
      global: {
        plugins: [pinia]
      }
    })
    expect(wrapper.text()).not.toContain('superman')
    expect(wrapper.text()).not.toContain('Delete account')
  })
})
