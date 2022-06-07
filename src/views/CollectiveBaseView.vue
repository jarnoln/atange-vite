<template>
  <div v-if="collectiveStore.currentCollective !== undefined">
    <h1 id="collective-title">{{ collectiveStore.currentCollective.title }}</h1>
    <p id="collective-description">{{ collectiveStore.currentCollective.description }}</p>
    <div id="collective-view-container">
      <router-view></router-view>
    </div>
  </div>
  <p v-else>Unknown collective</p>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { EventService } from '../services/EventService'

const props = defineProps<{
  collectiveName: string
}>()

const collectiveStore = useCollectiveStore()

onMounted(async () => {
  console.log('CollectiveBaseView mounted')
  if (collectiveStore.count === 0) {
    // console.log('CollectiveBase:onMounted:wait for fetch collectives')
    await EventService.fetchCollectives()
  }
  if ((props.collectiveName) && (props.collectiveName != collectiveStore.currentCollectiveName)) {
    collectiveStore.selectCollective(props.collectiveName)
    // console.log('CollectiveBase:onMounted:wait for fetch permissions')
    await EventService.fetchPermissions(props.collectiveName)
    // console.log('CollectiveBase:onMounted:permissions fetched')
    // console.log('CollectiveBase:onMounted:wait for fetch questions')
    await EventService.fetchQuestions(props.collectiveName)
    // console.log('CollectiveBase:onMounted:questions fetched')
  }
})
</script>
