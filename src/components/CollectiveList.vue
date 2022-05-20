<template>
  <table>
    <thead>
      <tr>
        <th id="collective-count">Collectives: {{ collectiveStore.collectives.length }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="collective in collectiveStore.collectives">
        <td> <router-link :to="{ name: 'collective', params: { collectiveName: collective.name }}">{{ collective.title }}</router-link> </td>
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
  collectiveStore.addExampleCollectives()
})

function deleteCollective(collective: Collective) {
    collectiveStore.deleteCollective(collective.name)
    EventService.deleteCollective(collective)
}
</script>
