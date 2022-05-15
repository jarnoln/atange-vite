import { defineStore } from 'pinia'
import { Notification } from '../types'

export const useNotificationStore = defineStore('NotificationStore', {
  state: () => ({
    notifications: [] as Notification[],
  }),
  getters: {
    latestNotification(): Notification {
      const count: number = this.notifications.length
      if (count === 0) {
        return {
          id: '',
          message: '',
          class: ''
        }
      }
      return this.notifications[count -1]
    }
  },
  actions: {
    notifyRegisteringOn() {
      console.log('NotificationStore:notifyRegisteringOn()')
      this.notifications.push({
        id: 'registering',
        message: 'Registering...',
        class: 'info'
      })
    },
    notifyRegisteringOff() {
      console.log('NotificationStore:notifyRegisteringOff()')
      this.notifications = this.notifications.filter(notification => notification.id != 'registering')
    },
    notifyLoggingInOn() {
      console.log('NotificationStore:notifyLoggingInOn()')
      this.notifications.push({
        id: 'logging_in',
        message: 'Logging in...',
        class: 'info'
      })
      console.log(this.notifications)
    },
    notifyLoggingInOff() {
      console.log('NotificationStore:notifyLoggingInOff()')
      this.notifications = this.notifications.filter(notification => notification.id != 'logging_in')
      console.log(this.notifications)
    },
    notifyError(message: string) {
      console.log('notifyError:', message)
      this.notifications.push({
        id: 'error',
        message: message,
        class: 'error'
      })
    }
  }
})
