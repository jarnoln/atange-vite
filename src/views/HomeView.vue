<template>
  <h1>Home</h1>
  <CollectiveList />
  <p>
  <router-link :to="{ name: 'create-collective' }">Create new collective</router-link>
  </p>
</template>

<script setup lang="ts">
import CollectiveList from '../components/CollectiveList.vue'

</script>
