<template>
  <div id="candidate-list-container" v-if="userGroupStore.candidates.length > 0">
    <h1>Candidates</h1>
    <table id="candidate-list-table">
      <thead>
        <tr>
            <th>Name</th>
            <th>Party</th>
            <th>District</th>
            <th v-for="question in questionStore.questionItems" :key="question.name" class="text-center">
              {{ question.order }}
            </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="candidate in userGroupStore.candidates" :key="candidate.username">
          <td>{{ candidate.firstName }} {{ candidate.lastName }}</td>
          <td><div v-if="candidate.party">{{ candidate.party.title }}</div></td>
          <td><div v-if="candidate.district">{{ candidate.district.title }}</div></td>
          <td
            v-for="question in questionStore.questionItems"
            :key="question.name"
            :class="'answer' + questionStore.getUserAnswerLetter(question.name, candidate.username)"
            class="answerCell">
            {{ questionStore.getUserAnswerLetter(question.name, candidate.username) }}
          </td>
        </tr>
      </tbody>
    </table>
    <p>
      <div v-for="question in questionStore.questionItems" :key="question.name" style="font-size: small;">
          {{ question.order }} {{ question.title }}
      </div>
    </p>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { useQuestionStore } from '../stores/QuestionStore'
import { useUserGroupStore } from '../stores/UserGroupStore'
import { EventService } from '../services/EventService';

const collectiveStore = useCollectiveStore()
const questionStore = useQuestionStore()
const userGroupStore = useUserGroupStore()

onBeforeMount(async () => {
  await EventService.fetchUserGroups()
  await EventService.fetchAllUserGroupMembers()
  EventService.fetchCandidates()
  await EventService.fetchCollectives()
  collectiveStore.visibleCollectives.forEach(collective => {
    EventService.fetchQuestions(collective.name)
  })
})
</script>

<style scoped>
td a {
  color: black;
  text-decoration: none;
}

td a:visited {
  color: black;
}

a:hover {
  text-decoration: underline;
}

td:hover {
  background-color: rgb(240, 220, 255);
}

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
