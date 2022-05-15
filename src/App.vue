<template>
  <nav-bar />
  <notifications />
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import Notifications from './components/Notifications.vue'
</script>

<style scoped>
.container {
  margin-left: 4rem;
  margin-right: 4rem;
}
</style>
