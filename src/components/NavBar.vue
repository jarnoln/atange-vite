<template>
  <nav id="navbar">
    <ul classid="right-links">
      <li>
        <router-link active-class="active" to="/">Home</router-link>
      </li>
    </ul>
    <ul id="left-links">
      <li v-if="!isLoggedIn()">
        <router-link active-class="active" to="/login">Login</router-link>
      </li>
      <li v-if="!isLoggedIn()">
        <router-link active-class="active" to="/register">Register</router-link>
      </li>
      <li v-if="isLoggedIn()">
        <a href="#">{{ getUsername() }}</a>
      </li>
      <li v-if="isLoggedIn()">
        <a href="#" @click="logout()">Logout</a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useSessionStore } from '../stores/SessionStore'
import { EventService } from '../services/EventService'

const sessionStore = useSessionStore()

function isLoggedIn() {
  return sessionStore.isLoggedIn
}

function getUsername() {
  return sessionStore.username
}

function logout() {
  EventService.logout()
  sessionStore.logout()
}
</script>

<style scoped>
#navbar {
  width: 100%;
  background-color: navy;
  display: flex;
  justify-content: space-between;
}

ul {
  list-style: none;
  display: flex;
  padding-left: 1rem;
}

#left-links {
  padding-right: 2rem;
}

a {
  text-decoration: none;
  color: grey;
  padding: 1rem;
}

a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

a.active {
  color: white;
}
</style>