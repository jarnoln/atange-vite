<template>
  <div v-if="collectiveStore.currentCollective !== undefined">
    <h1 id="collective-title">{{ collectiveStore.currentCollective.title }}</h1>
    <p id="collective-description">{{ collectiveStore.currentCollective.description }}</p>
    <table>
      <thead>
        <tr>
          <th>Questions: {{ questionStore.count }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="question in questionStore.questions">
          <td> {{ question.title }} </td>
        </tr>
      </tbody>
    </table>
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
// import { useRoute } from 'vue-router'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { useSessionStore } from '../stores/SessionStore'
import { useQuestionStore } from '../stores/QuestionStore'
import { EventService } from '../services/EventService';

const props = defineProps<{
  collectiveName: string
}>()

const collectiveStore = useCollectiveStore()
const sessionStore = useSessionStore()
const questionStore = useQuestionStore()

// const route = useRoute()

onMounted(() => {
  // const collectiveName = route.params.collectiveName as string
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
