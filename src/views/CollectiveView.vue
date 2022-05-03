<template>
  <table v-if="collectiveStore.selectedCollective !== undefined">
    <tbody>
      <tr>
        <th> Title </th>
        <td> {{ collectiveStore.selectedCollective.title }}</td>
      </tr>
    </tbody>
  </table>
  <p v-else>Unknown collective</p>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCollectiveStore } from '../stores/CollectiveStore'

const collectiveStore = useCollectiveStore()
collectiveStore.addExampleCollectives()
const route = useRoute()

onMounted(() => {
    const collectiveName = route.params.collectiveName as string
    collectiveStore.selectCollective(collectiveName)
})

</script>
