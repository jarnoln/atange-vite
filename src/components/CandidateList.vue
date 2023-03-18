<template>
  <div id="candidate-list-container" v-if="userGroupStore.candidates.length > 0">
    <h1>Candidates</h1>
    <table id="candidate-list-table">
      <thead>
        <tr>
            <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="candidate in userGroupStore.candidates" :key="candidate.username">
          <td>{{ candidate.firstName }} {{ candidate.lastName }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'
// import { RouterLink } from 'vue-router'
import { useUserGroupStore } from '../stores/UserGroupStore'
// import { useNotificationStore } from '../stores/NotificationStore'
// import { useSessionStore } from '../stores/SessionStore';
import { EventService } from '../services/EventService';

const userGroupStore = useUserGroupStore()
// const notificationStore = useNotificationStore()
// const sessionStore = useSessionStore()

onBeforeMount(async () => {
  await EventService.fetchUserGroups()
  EventService.fetchCandidates()
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
