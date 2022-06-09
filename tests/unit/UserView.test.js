import { mount } from '@vue/test-utils'
import { describe, expect, it, vitest } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { useSessionStore } from '../../src/stores/SessionStore'
import UserView from '../../src/views/UserView.vue'


const pinia = createTestingPinia({
  createSpy: vitest.fn,
  stubActions: false
})

const sessionStore = useSessionStore()


describe('Test UserView', () => {
  it('shows username', () => {
    sessionStore.login('superman', 'abcd')
    const wrapper = mount(UserView)
    expect(wrapper.text()).toContain('superman')
  })
})
