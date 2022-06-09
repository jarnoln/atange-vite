<template>
  <div v-if="sessionStore.username">
    <h1> {{ sessionStore.username }}</h1>
  </div>
</template>

<script setup lang="ts">
import { useSessionStore } from '../stores/SessionStore'

const sessionStore = useSessionStore()
</script>
