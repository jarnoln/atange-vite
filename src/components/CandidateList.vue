<template>
  <div id="candidate-list-container" v-if="userGroupStore.candidates.length > 0">
    <h1 v-if="settingsStore.oneCollective && collectiveStore.currentCollective">{{ collectiveStore.currentCollective.title }}</h1>
    <h1 v-else>{{ $t('candidates') }}</h1>
    <p v-if="settingsStore.oneCollective && collectiveStore.currentCollective">{{ collectiveStore.currentCollective.description }}</p>
    <table id="candidate-list-table">
      <thead>
        <tr>
            <th>{{ $t('candidate') }}</th>
            <th>{{ $t('party') }}</th>
            <th>{{ $t('district') }}</th>
            <th v-for="question in questionStore.questionItems" :key="question.name" class="text-center">
              {{ question.order }}
            </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="candidate in userGroupStore.candidates" :key="candidate.username">
          <td>
            <router-link :to="{ name: 'candidate-view', params: { candidateName: candidate.username }}">
              {{ candidate.firstName }} {{ candidate.lastName }}
            </router-link>
          </td>
          <td><div v-if="candidate.party">{{ candidate.party.title }}</div></td>
          <td><div v-if="candidate.district">{{ candidate.district.title }}</div></td>
          <td
            v-for="question in questionStore.questionItems"
            :key="question.name"
            :class="'answer' + questionStore.getUserAnswerLetter(question.name, candidate.username)"
            class="answerCell">
            {{ $t(questionStore.getUserAnswerString(question.name, candidate.username)) }}
          </td>
        </tr>
      </tbody>
    </table>
    <h3>{{ $t('questions') }}</h3>
    <p>
      <div v-for="question in questionStore.questionItems" :key="question.name" style="font-size: medium;">
        <router-link v-if="collectiveStore.currentCollective" :to="{ name: 'question', params: { collectiveName: collectiveStore.currentCollective.name, questionName: question.name }}">
          {{ question.order }} {{ question.title }}
        </router-link>
      </div>
    </p>
    <p>{{ $t('candidateListInstructions') }}</p>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { useQuestionStore } from '../stores/QuestionStore'
import { useSettingsStore } from '../stores/SettingsStore'
import { useUserGroupStore } from '../stores/UserGroupStore'
import { EventService } from '../services/EventService';

const collectiveStore = useCollectiveStore()
const questionStore = useQuestionStore()
const settingsStore = useSettingsStore()
const userGroupStore = useUserGroupStore()

onBeforeMount(async () => {
  if (!userGroupStore.loaded) {
    await EventService.fetchUserGroups()
  }
  if (!userGroupStore.membersLoaded) {
    await EventService.fetchAllUserGroupMembers()
  }
  if (userGroupStore.candidates.length === 0) {
    EventService.fetchCandidates()
  }
  if (collectiveStore.count === 0) {
    await EventService.fetchCollectives()
  }
  if (collectiveStore.count === 1) {
    if (collectiveStore.currentCollectiveName === '') {
      const collectiveName = collectiveStore.collectives[0].name
      collectiveStore.selectCollective(collectiveName)
    }
  }
  if (questionStore.count === 0) {
    collectiveStore.visibleCollectives.forEach(collective => {
      EventService.fetchQuestions(collective.name)
    })
  }
})
</script>

<style scoped>
a {
  color: black;
  text-decoration: none;
}

a:visited {
  color: black;
}

a:hover {
  text-decoration: underline;
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
