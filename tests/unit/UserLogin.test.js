import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, test, vi, vitest } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '../../src/routes'
import en from '../../src/locales/en.json'
import UserLogin from '../../src/components/UserLogin.vue'

vi.mock('axios')

const router = createRouter({
  history: createWebHistory(), // Use browser built-in history
  routes: routes
})

const pinia = createTestingPinia({
  createSpy: vitest.fn,
})

const messages = {
  'en': en
}

const i18n = createI18n({
  locale: 'en',
  messages
})

describe('Test UserLogin', () => {
  test('test using test utils', async () => {
    const wrapper = mount(UserLogin, {
      global: {
        plugins: [i18n, router, pinia]
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
