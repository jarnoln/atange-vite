import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, test, vitest } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '../../src/routes'
import UserLogin from '../../src/components/UserLogin.vue'

const router = createRouter({
  history: createWebHistory(), // Use browser built-in history
  routes: routes
})

const pinia = createTestingPinia({
  createSpy: vitest.fn,
})

describe('Test UserLogin', () => {
  test('test using test utils', async () => {
    const wrapper = mount(UserLogin, {
      global: {
        plugins: [router, pinia]
      }
    })
    expect(wrapper.text()).toContain('Name')
    expect(wrapper.text()).toContain('Password')
    const userNameInput = wrapper.get('#user-name')
    const passwordInput = wrapper.get('#password')
    const submitButton = wrapper.get('#submit-button')
    expect(userNameInput.isVisible()).toBe(true)
    expect(passwordInput.isVisible()).toBe(true)
    expect(submitButton.isVisible()).toBe(true)
    expect(submitButton.attributes().disabled).toBe('true')
    userNameInput.setValue('superman')
    passwordInput.setValue('ManOfSteel')
    await wrapper.vm.$nextTick()
    // expect(collectiveCreateButton.attributes().disabled).toBeUndefined()
    submitButton.trigger('click')
  })
})
