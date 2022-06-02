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

<style>
.container {
  margin-left: 4rem;
  margin-right: 4rem;
}

.text-left {
  text-align: start
}

.text-right {
  text-align: end;
}

.text-center {
  text-align: center;
}

.dark-background {
  background-color: navy;
}

.light-background {
  background-color: rgb(100, 100, 255);
}

th {
  text-align: start;
  padding: 5px;
}
</style>
