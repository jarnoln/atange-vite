<template>
  <div v-if="question">
    <h1 id="question-title">{{ question.title }}</h1>
    <p id="question-description">{{ question.description }}</p>
    <h2 id="approval-title">Approval: {{ approvalText }} %</h2>
    <div> Yes: {{ approval.yes }} No: {{ approval.no }} Abstain: {{ approval.abstain }}</div>
    <p v-if="sessionStore.isLoggedIn">
      <button id="answer-yes-btn" @click="voteYes">Yes</button>
      <button id="answer-abstain-btn" @click="voteAbstain">Abstain</button>
      <button id="answer-no-btn" @click="voteNo">No</button>
    </p>
  </div>
  <p v-else>Unknown question</p>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
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
const approval = reactive(questionStore.getApproval(props.questionName))
const approvalText = ref('-')

onMounted(() => {
  console.log('QuestionView mounted')
})

function updateApproval() {
  const newApproval = questionStore.getApproval(props.questionName)
  approval.yes = newApproval.yes
  approval.no = newApproval.no
  approval.abstain = newApproval.abstain
  approval.opinions = newApproval.opinions
  approval.votes = newApproval.votes
  approval.approvalPct = newApproval.approvalPct
  if (approval.approvalPct === null) {
    approvalText.value = '-'
  } else {
    approvalText.value = approval.approvalPct.toFixed(1)
  }
}

function voteYes() {
  questionStore.setAnswer(props.questionName, sessionStore.username, 1, '')
  updateApproval()
}

function voteAbstain() {
  questionStore.setAnswer(props.questionName, sessionStore.username, 0, '')
  updateApproval()
}

function voteNo() {
  questionStore.setAnswer(props.questionName, sessionStore.username, -1, '')
  updateApproval()
}

</script>
