<template>
  <table>
    <thead>
      <tr>
        <th>Collective</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="collective in collectives">
        <td> {{ collective.title }} </td> <td> <button @click="deleteCollective(collective)">Delete</button></td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Collective } from '../types'

const collectiveList : Collective[] = []
collectiveList.push({ name: 'jla', title: 'JLA'})
collectiveList.push({ name: 'jsa', title: 'JSA'})
collectiveList.push({ name: 'section8', title: 'Section 8'})
const collectives = ref(collectiveList);

function deleteCollective(collective: Collective) {
    const index = collectives.value.indexOf(collective)
    if (index > -1) {
        collectives.value.splice(index, 1)
    }
}
</script>
