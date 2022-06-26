<template>
  <div v-if="collectiveStore.currentCollective !== undefined">
    <p v-if="notificationStore.isLoadingQuestions">
      Loading...
    </p>
    <p v-else-if="questionStore.count === 0">No questions</p>
    <table v-else id="questions-table">
      <caption>Questions: {{ questionStore.count }}</caption>
      <thead>
        <tr>
          <th class="text-left dim-background" style="width:90%">Question</th>
          <th class="text-right dim-background">Yes</th>
          <th class="text-right dim-background">Abs</th>
          <th class="text-right dim-background">No</th>
          <th class="text-right dim-background">Approval</th>
          <th class="text-left dim-background" v-if="canEditQuestions">Actions</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="question in questionStore.questions" :key="question.name">
          <tr v-if="question.itemType === 'Q'">
            <td>
              <router-link :to="{ name: 'question', params: { collectiveName: collectiveStore.currentCollective.name, questionName: question.name }}">
                {{ question.title }}
              </router-link>
            </td>
            <td class="text-right">{{ questionStore.getApproval(question.name).yes }}</td>
            <td class="text-right">{{ questionStore.getApproval(question.name).abstain }}</td>
            <td class="text-right">{{ questionStore.getApproval(question.name).no }}</td>
            <td class="text-right"> {{ questionStore.getApproval(question.name).approvalPct }} %</td>
            <td v-if="canEditQuestions">
              <router-link
                :to="{ name: 'question-edit', params: { collectiveName: collectiveStore.currentCollective.name, questionName: question.name }}">
                  Edit
              </router-link>
            </td>
          </tr>
          <tr v-else>
            <td class="light-background" colspan="5"> {{ question.title }}</td>
            <td class="light-background" v-if="canEditQuestions">
              <router-link
                :to="{ name: 'question-edit', params: { collectiveName: collectiveStore.currentCollective.name, questionName: question.name }}">
                  Edit
              </router-link>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <p v-if="canEditQuestions">
      <router-link
        class="btn"
        :to="{ name: 'create-question', params: { collectiveName: collectiveStore.currentCollective.name, questionName: '', itemType: 'Q' }}">
          Add question
      </router-link>
      <router-link
        class="btn"
        :to="{ name: 'create-question', params: { collectiveName: collectiveStore.currentCollective.name, questionName: '', itemType: 'H' }}">
          Add header
      </router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { RouterLink } from 'vue-router'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { useNotificationStore } from '../stores/NotificationStore'
import { useQuestionStore } from '../stores/QuestionStore'
import { useSessionStore } from '../stores/SessionStore'

const collectiveStore = useCollectiveStore()
const questionStore = useQuestionStore()
const sessionStore = useSessionStore()
const notificationStore = useNotificationStore()

const canEditQuestions = computed(() => {
  if (collectiveStore.currentCollective) {
    if (sessionStore.isLoggedIn) {
      return collectiveStore.currentCollective.permissions.canEdit
    }
  }
  return false
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

td a:hover {
  text-decoration: underline;
}

#questions-table {
  width: 100%
}

caption {
  text-align: start;
  font-weight: bold;
  /* caption-side: bottom; */
}
</style>
