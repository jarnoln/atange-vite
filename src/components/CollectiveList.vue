<template>
  <div id="collective-list-container">
    <table id="collective-list-table">
      <tbody>
        <tr v-for="collective in collectiveStore.collectives" :key="collective.name">
          <td> <router-link :to="{ name: 'collective-view', params: { collectiveName: collective.name }}">{{ collective.title }}</router-link> </td>
        </tr>
      </tbody>
    </table>
    <p v-if="sessionStore.isLoggedIn">
      <router-link class="btn" id="create-collective-button" :to="{ name: 'create-collective' }">Create new</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { RouterLink } from 'vue-router'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { EventService } from '../services/EventService';
import { useSessionStore } from '../stores/SessionStore';

const collectiveStore = useCollectiveStore()
const sessionStore = useSessionStore()

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
