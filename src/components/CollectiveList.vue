<template>
  <table>
    <thead>
      <tr>
        <th id="collective-count">Collectives: {{ collectiveStore.collectives.length }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="collective in collectiveStore.collectives" :key="collective.name">
        <td> <router-link :to="{ name: 'collective-view', params: { collectiveName: collective.name }}">{{ collective.title }}</router-link> </td>
        <td v-if="sessionStore.isLoggedIn">
          <router-link :to="{ name: 'collective-edit', params: { collectiveName: collective.name }}">Edit</router-link>
        </td>
        <td v-if="sessionStore.isLoggedIn"> <a href="#" @click="deleteCollective(collective)">Delete {{ collective.title }}</a></td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Collective } from '../types'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { EventService } from '../services/EventService';
import { useSessionStore } from '../stores/SessionStore';

const collectiveStore = useCollectiveStore()
const sessionStore = useSessionStore()

onMounted(() => {
  EventService.fetchCollectives()
})

function deleteCollective(collective: Collective) {
    collectiveStore.deleteCollective(collective.name)
    EventService.deleteCollective(collective)
}
</script>
