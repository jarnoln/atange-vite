<template>
  <div v-if="question && question.name">
    <h2 id="question-title">{{ question.title }}</h2>
    <p id="question-description" v-html="question.description"></p>
    <h3 id="approval-title">{{ $t('approval')}}: {{ approvalText }} %</h3>
    <div v-if="sessionStore.isLoggedIn">
      <p>
        <button class="btn" id="answer-yes-btn" @click="voteYes">
          {{ $t('yes')}}
        </button>
        <button class="btn" id="answer-abstain-btn" @click="voteAbstain">
          {{ $t('abstain')}}
        </button>
        <button class="btn" id="answer-no-btn" @click="voteNo">
          {{ $t('no')}}
        </button>
      </p>
      <div style="font-weight: bold; text-align: center">{{ $t('commentAnswer')}}:</div>
      <p>
        <textarea id="answer-comment-input" rows="2" cols="40" v-model.trim="answerComment" />
      </p>
    </div>
    <p v-if="collectiveStore.currentCollective">
      <router-link :to="{ name: 'collective-view', params: { collectiveName: collectiveStore.currentCollective.name }}">
        {{ $t('back')}}
      </router-link>
    </p>
    <table>
      <thead>
        <tr>
          <th id="yes-header" class="light-background">{{ $t('yes')}}: {{ approval.yes }}</th>
          <th id="abstain-header" class="light-background">{{ $t('abstain')}}: {{ approval.abstain }}</th>
          <th id="no-header" class="light-background">{{ $t('no')}}: {{ approval.no }}</th>
        </tr>
      </thead>
      <td>
        <div v-for="yea in questionStore.getYeas(question.name)" :key="yea.user">
          <div>{{ yea.user }}</div>
          <div v-if="yea.comment" class="comment">
            {{ yea.comment }}
          </div>
        </div>
      </td>
      <td>
        <div v-for="abstain in questionStore.getAbstains(question.name)" :key="abstain.user">
          <div>{{ abstain.user }}</div>
          <div v-if="abstain.comment" class="comment">
            {{ abstain.comment }}
          </div>
        </div>
      </td>
      <td>
        <div v-for="nay in questionStore.getNays(question.name)" :key="nay.user">
          <div>{{ nay.user }}</div>
          <div v-if="nay.comment" class="comment">
            {{ nay.comment }}
          </div>
        </div>
      </td>
    </table>
  </div>
  <p v-else>Unknown question</p>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
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
const answerComment = ref('')
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
  questionStore.setAnswer(props.questionName, sessionStore.username, vote, answerComment.value)
  updateApproval()
  EventService.updateAnswer(props.questionName, sessionStore.username, vote, answerComment.value)
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

<style scoped>
h2, h3, h4, p {
  text-align: center;
}

table {
  width: 100%;
}

th, td {
  text-align: center;
}

.comment {
  font-style: italic;
}
</style>
