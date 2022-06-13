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
          <th class="text-right dim-background">#</th>
          <th class="text-left dim-background">Question</th>
          <th class="text-left dim-background">Type</th>
          <th class="text-left dim-background" v-if="canEditQuestions" colspan="2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="question in questionStore.questions" :key="question.name">
          <tr>
            <td class="text-right">{{ question.order }}</td>
            <td>
              <router-link :to="{ name: 'question', params: { collectiveName: collectiveStore.currentCollective.name, questionName: question.name }}">
                {{ question.title }}
              </router-link>
            </td>
            <td>{{ question.itemType }}</td>
            <template v-if="canEditQuestions">
              <td><button @click="questionStore.moveQuestionUp(question.name)">Up</button></td>
              <td><button @click="questionStore.moveQuestionDown(question.name)">Down</button></td>
            </template>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { useNotificationStore } from '../stores/NotificationStore';
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
