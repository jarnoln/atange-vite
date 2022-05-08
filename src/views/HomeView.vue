<template>
  <h1>Home</h1>
  <CollectiveList />
  <p>
  <router-link :to="{ name: 'create-collective' }">Create new collective</router-link>
  </p>
  <p>
    <button @click="fetchCollectives()">Fetch collectives</button>
  </p>
</template>

<script setup lang="ts">
import CollectiveList from '../components/CollectiveList.vue'
import EventService from '../services/EventService'


function fetchCollectives() {
  EventService.fetchCollectives()
}
</script>
