<template>
  <div v-if="question">
    <h1 id="question-title">{{ question.title }}</h1>
    <p id="question-description">{{ question.description }}</p>
    <p v-if="sessionStore.isLoggedIn">
      <button>Yes</button>
      <button>Abstain</button>
      <button>No</button>
    </p>
  </div>
  <p v-else>Unknown question</p>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { useQuestionStore } from '../stores/QuestionStore'
import { useSessionStore } from '../stores/SessionStore'
import { EventService } from '../services/EventService'

const props = defineProps<{
  questionName: string
}>()

const collectiveStore = useCollectiveStore()
const questionStore = useQuestionStore()
const sessionStore = useSessionStore()

const question = questionStore.getQuestion(props.questionName)

onMounted(() => {
  console.log('QuestionView mounted')
})
</script>
