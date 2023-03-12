<template>
  <nav-bar />
  <notifications />
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import Notifications from './components/Notifications.vue'
import { useSessionStore } from './stores/SessionStore';
import { onBeforeMount } from 'vue'
import { EventService } from './services/EventService'

onBeforeMount(() => {
  if (localStorage.username && localStorage.token) {
    console.log('User data found in localStorage. Logging in.')
    const sessionStore = useSessionStore()
    sessionStore.username = localStorage.username
    sessionStore.token = localStorage.token
    EventService.fetchUserInfo()
    EventService.fetchMemberships()
  }
})
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

.dim-background {
  background-color: rgb(200, 140, 255);
}

.light-background {
  background-color: rgb(230, 200, 255);
}

h1 {
  text-transform: uppercase;
  text-align: center;
}

th {
  text-align: start;
  padding: 5px;
}

.btn {
  font: inherit;
  text-decoration: none;
  border: 2px solid #512483;
  color: white;
  background-color: #512483;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  margin: 0 0.5rem 0 0;
}

.btn:hover {
  box-shadow: none;
  border: 2px solid black;
  background-color: #613493;
}

.btn:disabled {
  color: rgb(220, 220, 220);
  box-shadow: none;
  background-color: rgb(200, 140, 255);
  border-color: rgb(200, 140, 255);
}

.btn-danger {
  background-color: red;
  border: 2px solid red;
}

.btn-danger:disabled {
  background-color: rgb(255, 50, 50);
  border-color: rgb(255, 50, 50);
}
</style>
