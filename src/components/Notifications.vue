<template>
  <div id="notifications" :class="getActiveNotification().class">
    <span id="active-notification">{{ getActiveNotification().message }}</span>
    <button
      id="ack-notification-btn"
      v-if="isNotificationAckable()"
      @click="ackNotification(getActiveNotification().id)"
    >X</button>
  </div>
</template>

<script setup lang="ts">
import { Notification } from '../types'
import { useNotificationStore } from '../stores/NotificationStore';

const notificationStore = useNotificationStore()

function getActiveNotification() : Notification {
  return notificationStore.latestNotification
}

function isNotificationAckable() {
  if (notificationStore.notifications.length === 0) {
    return false
  } else {
    return true
  }
}

function ackNotification(notificationId: string) {
  notificationStore.removeNotification(notificationId)
}

</script>

<style scoped>
#notifications {
  height: 2rem;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
}

#notifications.info {
  color: #000033;
  background-color: #bbbbff;
}
#notifications.success {
  color: #003300;
  background-color: #bbffbb;
}

#notifications.error {
  color: #330000;
  background-color: #f55;
}

#active-notification {
  padding-top: 0.2rem;
}
#notifications.invisible {
  color: rgba(0, 0, 0, 0);
  background-color:rgba(0, 0, 0, 0);
}

#ack-notification-btn {
  width: 2rem;
  height: 2rem;
  font: inherit;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.75);
  background-color: rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(0, 0, 0, 0.25);
  border-radius: 15px;
  padding: 0.1rem 0.2rem;
}

#ack-notification-btn:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

</style>
