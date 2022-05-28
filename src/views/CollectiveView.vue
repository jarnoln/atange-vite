<template>
  <div v-if="collectiveStore.currentCollective !== undefined">
    <table>
      <thead>
        <tr>
          <th>Questions: {{ questionStore.count }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="question in questionStore.questions">
          <td>
            <router-link :to="{ name: 'question', params: { questionName: question.name }}">
              {{ question.title }}
            </router-link>
            </td>
          <td v-if="canEditQuestions">
            <router-link
              :to="{ name: 'question-edit', params: { collectiveName: collectiveStore.currentCollective.name, questionName: question.name }}">
                Edit
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
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
