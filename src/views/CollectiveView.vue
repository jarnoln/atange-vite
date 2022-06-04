<template>
  <p v-if="sessionStore.isLoggedIn && collectiveStore.currentCollective">
    <router-link class="btn" :to="{ name: 'collective-edit', params: { collectiveName: collectiveStore.currentCollective.name }}">
      Edit {{ collectiveStore.currentCollective.title }}
    </router-link>
  </p>
  <question-list></question-list>
</template>

<script setup lang="ts">
import QuestionList from '../components/QuestionList.vue'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { useSessionStore } from '../stores/SessionStore'

const collectiveStore = useCollectiveStore()
const sessionStore = useSessionStore()
</script>
