<template>
  <div v-if="collectiveStore.currentCollective !== undefined">
    <p v-if="questionStore.count === 0">No questions</p>
    <table v-else id="questions-table">
      <caption>Questions: {{ questionStore.count }}</caption>
      <thead>
        <tr>
          <th class="text-left light-background">Question</th>
          <th class="text-right light-background">Yes</th>
          <th class="text-right light-background">No</th>
          <th class="text-right light-background">Abstain</th>
          <th class="text-right light-background">Approval</th>
          <th class="text-right light-background" v-if="canEditQuestions">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="question in questionStore.questions" :key="question.name">
          <td>
            <router-link :to="{ name: 'question', params: { collectiveName: collectiveStore.currentCollective.name, questionName: question.name }}">
              {{ question.title }}
            </router-link>
          </td>
          <td class="text-right">{{ questionStore.getApproval(question.name).yes }}</td>
          <td class="text-right">{{ questionStore.getApproval(question.name).no }}</td>
          <td class="text-right">{{ questionStore.getApproval(question.name).abstain }}</td>
          <td class="text-right"> {{ questionStore.getApproval(question.name).approvalPct }} %</td>
          <td v-if="canEditQuestions">
            <router-link
              :to="{ name: 'question-edit', params: { collectiveName: collectiveStore.currentCollective.name, questionName: question.name }}">
                Edit
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="sessionStore.isLoggedIn">
      <router-link :to="{ name: 'create-question', params: { collectiveName: collectiveStore.currentCollective.name, questionName: '' }}">Add question</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { useCollectiveStore } from '../stores/CollectiveStore'
import { useQuestionStore } from '../stores/QuestionStore'
import { useSessionStore } from '../stores/SessionStore'

const collectiveStore = useCollectiveStore()
const questionStore = useQuestionStore()
const sessionStore = useSessionStore()

const canEditQuestions = computed(() => {
  if (collectiveStore.currentCollective) {
    if (sessionStore.isLoggedIn) {
      return true
    }
  }
  return false
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

#questions-table {
  width: 100%
}

caption {
  text-align: start;
  font-weight: bold;
  caption-side: bottom;
}
</style>