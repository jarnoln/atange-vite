<template>
  <h1>Home</h1>
  <CollectiveList />
  <p v-if="isLoggedIn">
  <router-link :to="{ name: 'create-collective' }">Create new collective</router-link>
  </p>
  <p>
    <button @click="fetchCollectivesClicked()">Fetch collectives</button>
  </p>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CollectiveList from '../components/CollectiveList.vue'
import { EventService } from '../services/EventService'
import { useSessionStore } from '../stores/SessionStore'

const sessionStore = useSessionStore()
const isLoggedIn = ref(sessionStore.isLoggedIn)

function fetchCollectivesClicked() {
  EventService.fetchCollectives()
}
</script>
