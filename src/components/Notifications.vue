<template>
  <div id="notifications" :class="getNotificationClass()">
    {{ getNotificationMessage() }}
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '../stores/NotificationStore';

const notificationStore = useNotificationStore()

function getNotificationMessage() {
  if (notificationStore.notifications.length === 0) {
    return 'Placeholder'
  } else {
    return notificationStore.latestNotification.message
  }
}

function getNotificationClass() {
  if (notificationStore.notifications.length === 0) {
    return 'invisible'
  } else {
    return notificationStore.latestNotification.class
  }
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
