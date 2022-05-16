<template>
  <div v-if="collectiveStore.selectedCollective !== undefined">
    <h1 id="collective-title">{{ collectiveStore.selectedCollective.title }}</h1>
    <p id="collective-description">{{ collectiveStore.selectedCollective.description }}</p>
    <button id="delete-collective-btn" @click="deleteSelectedCollective()">Delete collective</button>
  </div>
  <p v-else>Unknown collective</p>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
// import { useRoute } from 'vue-router'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { EventService } from '../services/EventService';

const props = defineProps<{
  collectiveName: string
}>()

const collectiveStore = useCollectiveStore()
collectiveStore.addExampleCollectives()
// const route = useRoute()

onMounted(() => {
  // const collectiveName = route.params.collectiveName as string
  collectiveStore.selectCollective(props.collectiveName)
})

function deleteSelectedCollective() {
  const collective = collectiveStore.selectedCollective
  if (collective) {
    collectiveStore.deleteCollective(collective)
    EventService.deleteCollective(collective)
  }
}
</script>
