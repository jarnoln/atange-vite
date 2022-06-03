<template>
  <div v-if="collectiveStore.currentCollective !== undefined">
    <h1 id="collective-title">{{ collectiveStore.currentCollective.title }}</h1>
    <p id="collective-description">{{ collectiveStore.currentCollective.description }}</p>

    <router-view></router-view>

    <p v-if="sessionStore.isLoggedIn">
      <ul>
        <li><router-link :to="{ name: 'collective-edit', params: { collectiveName: collectiveStore.currentCollective.name }}">Edit</router-link></li>
        <li><router-link :to="{ name: 'create-question', params: { collectiveName: collectiveStore.currentCollective.name, questionName: '' }}">Add question</router-link></li>
      </ul>
    </p>
  </div>
  <p v-else>Unknown collective</p>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { useQuestionStore } from '../stores/QuestionStore'
import { useSessionStore } from '../stores/SessionStore'
import { EventService } from '../services/EventService'

const props = defineProps<{
  collectiveName: string
}>()

const collectiveStore = useCollectiveStore()
const questionStore = useQuestionStore()
const sessionStore = useSessionStore()


onMounted(async () => {
  console.log('CollectiveBaseView mounted')
  if (collectiveStore.count === 0) {
    console.log('CollectiveBase:onMounted:wait for fetch collectives')
    await EventService.fetchCollectives()
  }
  if ((props.collectiveName) && (props.collectiveName != collectiveStore.currentCollectiveName)) {
    collectiveStore.selectCollective(props.collectiveName)
    console.log('CollectiveBase:onMounted:wait for fetch questions')
    await EventService.fetchQuestions(props.collectiveName)
    console.log('CollectiveBase:onMounted:questions fetched')
  }
})
</script>
