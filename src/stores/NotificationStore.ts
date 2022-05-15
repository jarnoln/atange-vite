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
          class: '',
          details: '',
          needAck: false,
          ack: false,
          delay: 0
        }
      }
      return this.notifications[count -1]
    }
  },
  actions: {
    notifyWaitOn(id: string, message: string) {
      // Notifications shown when user needs to wait for some operation to finish (usually connecting to backend)
      // These will be automatically removed when operation is finished
      console.log('NotificationStore:notifyWait(' + id + ', ' + message +')')
      this.notifications.push({
        id: id,
        message: message,
        class: 'info',
        details: '',
        needAck: false,
        ack: false,
        delay: 0
      })
    },
    notifyWaitOff(id: string) {
      // Remove notification
      this.notifications = this.notifications.filter(notification => notification.id != id)
    },
    notifyRegisteringOn() {
      console.log('NotificationStore:notifyRegisteringOn()')
      this.notifyWaitOn('registering', 'Registering...')
    },
    notifyRegisteringOff() {
      console.log('NotificationStore:notifyRegisteringOff()')
      this.notifyWaitOff('registering')
    },
    notifyLoggingInOn() {
      console.log('NotificationStore:notifyLoggingInOn()')
      this.notifyWaitOn('logging_in', 'Logging in...')
    },
    notifyLoggingInOff() {
      console.log('NotificationStore:notifyLoggingInOff()')
      this.notifyWaitOff('logging_in')
    },
    notifyError(message: string) {
      console.log('notifyError:', message)
      this.notifications.push({
        id: 'error',
        message: message,
        class: 'error',
        details: '',
        needAck: true,
        ack: false,
        delay: 0
      })
    }
  }
})
