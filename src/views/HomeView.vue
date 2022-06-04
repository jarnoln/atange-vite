<template>
  <CollectiveList />
  <p v-show="false">
    <button @click="fetchCollectivesClicked">Fetch collectives</button>
  </p>
</template>

<script setup lang="ts">
import CollectiveList from '../components/CollectiveList.vue'
import { EventService } from '../services/EventService'

function fetchCollectivesClicked() {
  EventService.fetchCollectives()
}
</script>
