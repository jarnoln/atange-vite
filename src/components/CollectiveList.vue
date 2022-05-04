<template>
  <table>
    <thead>
      <tr>
        <th id="collective-count">Collectives: {{ collectives.length }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="collective in collectives">
        <td> <router-link :to="{ name: 'collective', params: { collectiveName: collective.name }}">{{ collective.title }}</router-link> </td>
        <td> <a href="#" @click="deleteCollective(collective)">Delete {{ collective.title }}</a></td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Collective } from '../types'
import { useCollectiveStore } from '../stores/CollectiveStore'

const collectiveStore = useCollectiveStore()
const collectives = ref(collectiveStore.collectives)

onMounted(() => {
  collectiveStore.addExampleCollectives()
})

function deleteCollective(collective: Collective) {
    collectiveStore.deleteCollective(collective)
}
</script>
