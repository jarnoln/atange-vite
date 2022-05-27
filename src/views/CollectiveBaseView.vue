<template>
  <div v-if="collectiveStore.currentCollective !== undefined">
    <h1 id="collective-title">{{ collectiveStore.currentCollective.title }}</h1>
    <p id="collective-description">{{ collectiveStore.currentCollective.description }}</p>

    <router-view></router-view>

    <p v-if="sessionStore.isLoggedIn">
      <ul>
        <li><router-link :to="{ name: 'collective-edit', params: { collectiveName: collectiveStore.currentCollective.name }}">Edit</router-link></li>
        <li><router-link :to="{ name: 'create-question', params: { collectiveName: collectiveStore.currentCollective.name, questionName: '' }}">Add question</router-link></li>
        <li><button id="delete-collective-btn" @click="deleteSelectedCollective">Delete collective</button></li>
      </ul>
    </p>
  </div>
  <p v-else>Unknown collective</p>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { useSessionStore } from '../stores/SessionStore'
import { EventService } from '../services/EventService'

const props = defineProps<{
  collectiveName: string
}>()

const collectiveStore = useCollectiveStore()
const sessionStore = useSessionStore()


onMounted(() => {
  console.log('CollectiveBaseView mounted')
  collectiveStore.selectCollective(props.collectiveName)
})

function deleteSelectedCollective() {
  const collective = collectiveStore.currentCollective
  if (collective) {
    collectiveStore.deleteCollective(collective.name)
    EventService.deleteCollective(collective)
  }
}
</script>
