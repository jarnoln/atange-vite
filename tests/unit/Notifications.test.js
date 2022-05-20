import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { beforeEach, describe, expect, it, vitest } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '../../src/routes'
import { useNotificationStore } from '../../src/stores/NotificationStore'
import Notifications from '../../src/components/Notifications.vue'

const pinia = createTestingPinia({
  createSpy: vitest.fn,
  stubActions: false
})

const router = createRouter({
  history: createWebHistory(), // Use browser built-in history
  routes: routes
})

const notificationStore = useNotificationStore()


describe('Test Notifications', () => {
  beforeEach (() => {
    notificationStore.clear()
  }),
  it('shows placeholder when no notifications', async () => {
    const wrapper = mount(Notifications, {
      global: {
        plugins: [pinia, router]
      }
    })
    const notification = wrapper.get('#active-notification')
    expect(notification.text()).toBe('placeholder')
    const notifications = wrapper.get('#notifications')
    expect(notifications.classes()).toEqual(['invisible'])
  }),
  it('shows notification', async () => {
    const wrapper = mount(Notifications, {
      global: {
        plugins: [pinia, router]
      }
    })
    notificationStore.notifyWaitOn('loading', 'Loading...')
    await nextTick()
    const notification = wrapper.get('#active-notification')
    expect(notification.text()).toBe('Loading...')
    const notifications = wrapper.get('#notifications')
    expect(notifications.classes()).toEqual(['info'])
  }),
  it('shows only latest notification', async () => {
    const wrapper = mount(Notifications, {
      global: {
        plugins: [pinia, router]
      }
    })
    notificationStore.notifyWaitOn('loading', 'Loading...')
    notificationStore.notifyError('Server error')
    await nextTick()
    const notification = wrapper.get('#active-notification')
    expect(notification.text()).toBe('Server error')
    const notifications = wrapper.get('#notifications')
    expect(notifications.classes()).toEqual(['error'])
  }),
  it('can acknowledge notifications', async () => {
    const wrapper = mount(Notifications, {
      global: {
        plugins: [pinia, router]
      }
    })
    notificationStore.notifyError('Server error')
    expect(notificationStore.count).toBe(1)
    await nextTick()
    const notification = wrapper.get('#active-notification')
    expect(notification.text()).toBe('Server error')
    const notifications = wrapper.get('#notifications')
    expect(notifications.classes()).toEqual(['error'])
    const ackButton = wrapper.get('#ack-notification-btn')
    ackButton.trigger('click')
    await nextTick()
    expect(notificationStore.count).toBe(0)
    expect(notification.text()).toBe('placeholder')
    expect(notifications.classes()).toEqual(['invisible'])
  })
})
