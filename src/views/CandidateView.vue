<template>
  <div v-if="candidate">
    <h1>{{ candidate.firstName }} {{ candidate.lastName }}</h1>
    <table>
      <tr v-if="candidate.party">
        <th>{{ $t('party') }}</th>
        <td>{{ candidate.party.title }}</td>
      </tr>
      <tr v-if="candidate.district">
        <th>{{ $t('district') }}</th>
        <td>{{ candidate.district.title }}</td>
      </tr>
      <tr v-if="candidate.candidateNumber">
        <th>{{ $t('candidateNumber') }}</th>
        <td>{{ candidate.candidateNumber }}</td>
      </tr>
      <tr v-if="candidate.homepage">
        <th>{{ $t('homepage') }}</th>
        <td><a :href="candidate.homepage">{{ candidate.homepage }}</a></td>
      </tr>
      <tr v-if="candidate.description">
        <th colspan="2">{{ $t('description') }}</th>
      </tr>
      <tr v-if="candidate.description">
        <td colspan="2">{{ candidate.description }}</td>
      </tr>
    </table>
    <h2>{{ $t('answers') }}</h2>
    <table>
      <tr v-for="question in questionStore.questionItems" :key="question.name">
        <td>{{ question.order }}</td>
        <td>{{ question.title }}</td>
        <td :class="'answer' + questionStore.getUserAnswerLetter(question.name, candidate.username)"
            class="answerCell">
            {{ questionStore.getUserAnswerString(question.name, candidate.username) }}
        </td>
      </tr>
    </table>

  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { EventService } from '../services/EventService'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { useQuestionStore } from '../stores/QuestionStore'
import { useUserGroupStore } from '../stores/UserGroupStore'

const props = defineProps<{
  candidateName: string
}>()

const collectiveStore = useCollectiveStore()
const questionStore = useQuestionStore()
const userGroupStore = useUserGroupStore()
const candidate = ref(userGroupStore.getEmptyCandidate())

onBeforeMount(async () => {
  if (!userGroupStore.loaded) {
    await EventService.fetchUserGroups()
  }
  if (!userGroupStore.membersLoaded) {
    await EventService.fetchAllUserGroupMembers()
  }
  if (collectiveStore.count === 0) {
    await EventService.fetchCollectives()
  }
  if (userGroupStore.candidates.length === 0) {
    await EventService.fetchCandidates()
  }
  if (questionStore.count === 0) {
    await EventService.fetchAllQuestions()
  }
  await EventService.fetchCandidateDescription(props.candidateName)
  const currentCandidate = userGroupStore.getCandidate(props.candidateName)
  if (currentCandidate) {
    candidate.value = currentCandidate
  }
  console.log('CandidateView:candidate:', candidate)
})

</script>

<style scoped>
.answerCell {
  text-align: center;
  padding-left: 10px;
  padding-right: 10px;
}

.answerY {
  background-color: rgb(100, 255, 100);
}

.answerN {
  background-color: rgb(255, 100, 100);
}

</style>
