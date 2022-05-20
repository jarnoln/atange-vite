<template>
  <div id="notifications" :class="getActiveNotification().class">
    <button
      id="ack-notification-btn"
      v-if="isNotificationAckable()"
      @click="ackNotification(getActiveNotification().id)"
    >Ack</button>
    <span id="active-notification">{{ getActiveNotification().message }}</span>
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
  padding: 5px;
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

#notifications.invisible {
  color: rgba(0, 0, 0, 0);
  background-color:rgba(0, 0, 0, 0);
}
</style>
