<template>
  <table>
    <thead>
      <tr>
        <th>Collectives: {{ collectives.length }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="collective in collectives">
        <td> {{ collective.title }} </td> <td> <button @click="deleteCollective(collective)">Delete {{ collective.title }}</button></td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Collective } from '../types'
import { useCollectiveStore } from '../stores/CollectiveStore'

const collectiveStore = useCollectiveStore()

collectiveStore.addCollective({ name: 'jla', title: 'JLA'})
collectiveStore.addCollective({ name: 'jsa', title: 'JSA'})
collectiveStore.addCollective({ name: 'section8', title: 'Section 8'})

const collectives = ref(collectiveStore.collectives)
function deleteCollective(collective: Collective) {
    collectiveStore.deleteCollective(collective)
}
</script>
