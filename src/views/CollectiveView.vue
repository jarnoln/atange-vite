<template>
  <p v-if="collectiveStore.currentCollective && canEdit">
    <router-link id="edit-collective-button" class="btn" :to="{ name: 'collective-edit', params: { collectiveName: collectiveStore.currentCollective.name }}">
      Edit {{ collectiveStore.currentCollective.title }}
    </router-link>
  </p>
  <question-list></question-list>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import QuestionList from '../components/QuestionList.vue'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { useSessionStore } from '../stores/SessionStore'

const collectiveStore = useCollectiveStore()
const sessionStore = useSessionStore()

const canEdit = computed(() => {
  if (!sessionStore.isLoggedIn) {
    return false
  }
  if (collectiveStore.currentCollective) {
    return collectiveStore.currentCollective.permissions.canEdit
  } else {
    return false
  }
})
</script>
