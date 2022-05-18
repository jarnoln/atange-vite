import { defineStore } from 'pinia'
import { Notification } from '../types'

export const useNotificationStore = defineStore('NotificationStore', {
  state: () => ({
    notifications: [] as Notification[],
  }),
  getters: {
    count(state): number {
      return state.notifications.length
    },
    latestNotification(state): Notification {
      const count: number = state.notifications.length
      if (count === 0) {
        return {
          id: '',
          message: '',
          class: '',
          details: '',
          needAck: false,
          ack: false
        }
      }
      return state.notifications[count -1]
    }
  },
  actions: {
    clear() {
      this.notifications = []
    },
    removeNotification(id: string) {
      this.notifications = this.notifications.filter(notification => notification.id != id)
    },
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
        ack: false
      })
    },
    notifyWaitOff(id: string) {
      this.removeNotification(id)
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
    notifySuccess(id: string, message: string) {
      console.log('notifySuccess:', id)
      this.notifications.push({
        id: id,
        message: message,
        class: 'success',
        details: '',
        needAck: false,
        ack: false
      })
      setTimeout(this.removeNotification, 3000, id)
    },
    notifyError(message: string) {
      console.log('notifyError:', message)
      this.notifications.push({
        id: 'error',
        message: message,
        class: 'error',
        details: '',
        needAck: true,
        ack: false
      })
    }
  }
})
