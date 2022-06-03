<template>
  <div v-if="question && question.name">
    <h1 id="question-title">{{ question.title }}</h1>
    <p id="question-description">{{ question.description }}</p>
    <h2 id="approval-title">Approval: {{ approvalText }} %</h2>
    <div> Yes: {{ approval.yes }} No: {{ approval.no }} Abstain: {{ approval.abstain }}</div>
    <p v-if="sessionStore.isLoggedIn">
      <button id="answer-yes-btn" @click="voteYes">Yes</button>
      <button id="answer-abstain-btn" @click="voteAbstain">Abstain</button>
      <button id="answer-no-btn" @click="voteNo">No</button>
    </p>
    <p v-if="collectiveStore.currentCollective">
      <router-link :to="{ name: 'collective-view', params: { collectiveName: collectiveStore.currentCollective.name }}">Back</router-link>
    </p>
  </div>
  <p v-else>Unknown question</p>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { useQuestionStore } from '../stores/QuestionStore'
import { useSessionStore } from '../stores/SessionStore'
import { EventService } from '../services/EventService'
import { Question } from '../types'

const props = defineProps<{
  questionName: string
}>()

const collectiveStore = useCollectiveStore()
const questionStore = useQuestionStore()
const sessionStore = useSessionStore()
const approval = reactive(questionStore.getApproval(props.questionName))
const approvalText = ref('-')
const question : Question = reactive(questionStore.getQuestionSkeleton())

onMounted(async () => {
  console.log('QuestionView mounted')
  if (questionStore.count === 0) {
    if (collectiveStore.currentCollective) {
      console.log('QuestionView:fetch questions')
      await EventService.fetchQuestions(collectiveStore.currentCollective.name)
      console.log('QuestionView:fetched questions')
    }
  }
  updateQuestion()
  updateApproval()
})

function updateQuestion() {
  // TODO: There is probably a better way to do this
  const newQuestion = questionStore.getQuestion(props.questionName)
  if (newQuestion) {
    question.name = newQuestion.name
    question.title = newQuestion.title
    question.description = newQuestion.description
    question.itemType = newQuestion.itemType
    question.order = newQuestion.order
    question.parent = newQuestion.parent
    question.creator = newQuestion.creator
    question.answers = newQuestion.answers
  }
}

function updateApproval() {
  // TODO: There is probably a better way to do this
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

function updateAnswer(vote: number) {
  const comment = ''
  questionStore.setAnswer(props.questionName, sessionStore.username, vote, comment)
  updateApproval()
  EventService.updateAnswer(props.questionName, sessionStore.username, vote, comment)
}

function voteYes() {
  updateAnswer(1)
}

function voteAbstain() {
  updateAnswer(0)
}

function voteNo() {
  updateAnswer(-1)
}
</script>
