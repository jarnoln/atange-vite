import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useNotificationStore } from '../../../src/stores/NotificationStore'

const pinia = createPinia()
setActivePinia(pinia)

const notificationStore = useNotificationStore()

describe('Test NotificationStore', () => {
  beforeEach(() => {
    notificationStore.clear()
  }),
  it('gives placeholder notification when empty', () => {
    expect(notificationStore.count).toBe(0)
    const latest = notificationStore.latestNotification
    expect(latest.id).toBe('')
    expect(latest.message).toBe('placeholder')
    expect(latest.class).toBe('invisible')
    expect(latest.details).toBe('')
    expect(latest.needAck).toBe(false)
    expect(latest.ack).toBe(false)
  })
  it('can add wait notification', () => {
    expect(notificationStore.notifications.length).toBe(0)
    expect(notificationStore.count).toBe(0)
    notificationStore.notifyWaitOn('registering', 'Registering...')
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('registering')
    expect(notificationStore.latestNotification.message).toBe('Registering...')
    expect(notificationStore.latestNotification.class).toBe('info')
    expect(notificationStore.latestNotification.details).toBe('')
    expect(notificationStore.latestNotification.needAck).toBe(false)
    expect(notificationStore.latestNotification.ack).toBe(false)
  }),
  it('can remove wait notification', () => {
    notificationStore.notifyWaitOn('registering', 'Registering...')
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('registering')
    notificationStore.notifyWaitOff('registering')
    expect(notificationStore.count).toBe(0)
    expect(notificationStore.latestNotification.id).toBe('')
  })
  it('can add error notification', () => {
    expect(notificationStore.count).toBe(0)
    expect(notificationStore.latestNotification.id).toBe('')
    notificationStore.notifyError('Disconnected from server')
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('error')
    expect(notificationStore.latestNotification.message).toBe('Disconnected from server')
    expect(notificationStore.latestNotification.class).toBe('error')
    expect(notificationStore.latestNotification.details).toBe('')
    expect(notificationStore.latestNotification.needAck).toBe(true)
    expect(notificationStore.latestNotification.ack).toBe(false)
  }),
  it('can add and remove several notifications', () => {
    notificationStore.notifyWaitOn('registering', 'Registering...')
    expect(notificationStore.latestNotification.id).toBe('registering')
    expect(notificationStore.latestNotification.message).toBe('Registering...')
    expect(notificationStore.latestNotification.class).toBe('info')
    notificationStore.notifyWaitOn('loading', 'Loading...')
    expect(notificationStore.notifications.length).toBe(2)
    expect(notificationStore.count).toBe(2)
    expect(notificationStore.latestNotification.id).toBe('loading')
    expect(notificationStore.latestNotification.message).toBe('Loading...')
    expect(notificationStore.latestNotification.class).toBe('info')
    notificationStore.notifyError('Disconnected from server')
    expect(notificationStore.notifications.length).toBe(3)
    expect(notificationStore.latestNotification.message).toBe('Disconnected from server')
    expect(notificationStore.latestNotification.class).toBe('error')
    notificationStore.notifyWaitOff('registering')
    expect(notificationStore.notifications.length).toBe(2)
    expect(notificationStore.count).toBe(2)
    expect(notificationStore.latestNotification.id).toBe('error')
    expect(notificationStore.latestNotification.message).toBe('Disconnected from server')
    notificationStore.removeNotification('error')
    expect(notificationStore.notifications.length).toBe(1)
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('loading')
    expect(notificationStore.latestNotification.message).toBe('Loading...')
    notificationStore.notifyWaitOff('loading')
    expect(notificationStore.notifications.length).toBe(0)
    expect(notificationStore.count).toBe(0)
    expect(notificationStore.latestNotification.id).toBe('')
    expect(notificationStore.latestNotification.message).toBe('placeholder')
  })
})
