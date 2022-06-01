<template>
  <div v-if="question">
    <h1 id="question-title">{{ question.title }}</h1>
    <p id="question-description">{{ question.description }}</p>
    <h2> Approval: {{ approval }}</h2>
    <p v-if="sessionStore.isLoggedIn">
      <button id="answer-yes-btn" @click="voteYes">Yes</button>
      <button id="answer-abstain-btn" @click="voteAbstain">Abstain</button>
      <button id="answer-no-btn" @click="voteNo">No</button>
    </p>
  </div>
  <p v-else>Unknown question</p>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
// import { useCollectiveStore } from '../stores/CollectiveStore'
import { useQuestionStore } from '../stores/QuestionStore'
import { useSessionStore } from '../stores/SessionStore'
import { EventService } from '../services/EventService'

const props = defineProps<{
  questionName: string
}>()

// const collectiveStore = useCollectiveStore()
const questionStore = useQuestionStore()
const sessionStore = useSessionStore()
const question = questionStore.getQuestion(props.questionName)
const approval = ref(0)

onMounted(() => {
  console.log('QuestionView mounted')
})

function voteYes() {
  questionStore.setAnswer(props.questionName, sessionStore.username, 1, '')}

function voteAbstain() {
  questionStore.setAnswer(props.questionName, sessionStore.username, 0, '')
}

function voteNo() {
  questionStore.setAnswer(props.questionName, sessionStore.username, -1, '')
}

</script>
