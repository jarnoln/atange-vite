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
              <td><button :id="'move-up-' + question.name" @click="moveUp(question.name)">Up</button></td>
              <td><button :id="'move-down-' + question.name" @click="moveDown(question.name)">Down</button></td>
            </template>
          </tr>
        </template>
      </tbody>
    </table>
    <p v-if="canEditQuestions">
      <button id="save-changes-btn" class="btn" :disabled="!unsavedChanges" @click="saveChangesToBackend">
        Save changes
      </button>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from '@vue/reactivity'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { useNotificationStore } from '../stores/NotificationStore';
import { useQuestionStore } from '../stores/QuestionStore'
import { useSessionStore } from '../stores/SessionStore'
import { EventService } from '../services/EventService'

const collectiveStore = useCollectiveStore()
const questionStore = useQuestionStore()
const sessionStore = useSessionStore()
const notificationStore = useNotificationStore()
const unsavedChanges = ref(false)

const canEditQuestions = computed(() => {
  if (collectiveStore.currentCollective) {
    if (sessionStore.isLoggedIn) {
      return collectiveStore.currentCollective.permissions.canEdit
    }
  }
  return false
})

function moveUp(questionName: string) {
  questionStore.moveQuestionUp(questionName)
  unsavedChanges.value = true
}

function moveDown(questionName: string) {
  questionStore.moveQuestionDown(questionName)
  unsavedChanges.value = true
}

function saveChangesToBackend() {
  // TODO: Add support to backend to allow updating multiple questions with one API call
  // instead making separate call to update each question
  questionStore.questions.forEach(question => {
    EventService.updateQuestion(question.name, question)
  })
  unsavedChanges.value = false
}
</script>
