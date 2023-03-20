<template>
  <p v-if="notificationStore.isLoadingCollectives">
    Loading...
  </p>
  <div v-else id="collective-list-container">
    <table id="collective-list-table">
      <tbody>
        <tr v-for="collective in collectiveStore.visibleCollectives" :key="collective.name">
          <td> <router-link :to="{ name: 'collective-view', params: { collectiveName: collective.name }}">{{ collective.title }}</router-link> </td>
        </tr>
      </tbody>
    </table>
    <p v-if="sessionStore.isLoggedIn && settingsStore.usersCanCreateCollectives">
      <router-link class="btn" id="create-collective-button" :to="{ name: 'create-collective' }">Create new</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { RouterLink } from 'vue-router'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { useNotificationStore } from '../stores/NotificationStore'
import { useSessionStore } from '../stores/SessionStore';
import { useSettingsStore } from '../stores/SettingsStore';
import { EventService } from '../services/EventService';

const collectiveStore = useCollectiveStore()
const notificationStore = useNotificationStore()
const sessionStore = useSessionStore()
const settingsStore = useSettingsStore()

onBeforeMount(() => {
  EventService.fetchCollectives()
})
</script>

<style scoped>
td a {
  color: black;
  text-decoration: none;
}

td a:visited {
  color: black;
}

a:hover {
  text-decoration: underline;
}

td:hover {
  background-color: rgb(240, 220, 255);
}
</style>
