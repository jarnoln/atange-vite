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
  background-color: #512483;
}

.light-background {
  background-color: rgb(200, 100, 240);
}

th {
  text-align: start;
  padding: 5px;
}

a {
  color: black;
  text-decoration: none;
}

a:visited {
  color: black;
}
</style>
