<template>
  <h1>Home</h1>
  <CollectiveList />
  <p v-if="sessionStore.isLoggedIn">
  <router-link :to="{ name: 'create-collective' }">Create new collective</router-link>
  </p>
  <p>
    <button @click="fetchCollectivesClicked">Fetch collectives</button>
    <button @click="createExampleCollectives">Create example collectives</button>
  </p>
</template>

<script setup lang="ts">
import CollectiveList from '../components/CollectiveList.vue'
import { EventService } from '../services/EventService'
import { useSessionStore } from '../stores/SessionStore'
import { useCollectiveStore } from '../stores/CollectiveStore'

const sessionStore = useSessionStore()
const collectiveStore = useCollectiveStore()

function fetchCollectivesClicked() {
  EventService.fetchCollectives()
}

function createExampleCollectives() {
  collectiveStore.addExampleCollectives()
}
</script>
