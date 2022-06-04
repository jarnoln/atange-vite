<template>
  <nav id="navbar" class="dark-background">
    <ul id="right-links">
      <li>
        <router-link id="navbar-home" active-class="active" to="/">Home</router-link>
      </li>
    </ul>
    <ul id="left-links">
      <li v-if="!isLoggedIn()">
        <router-link id="navbar-login" active-class="active" to="/login">Login</router-link>
      </li>
      <li v-if="!isLoggedIn()">
        <router-link id="navbar-register" active-class="active" to="/register">Register</router-link>
      </li>
      <li v-if="isLoggedIn()">
        <a href="#" id="navbar-username">{{ getUsername() }}</a>
      </li>
      <li v-if="isLoggedIn()">
        <a href="#" id="navbar-logout" @click="logout()">Logout</a>
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
}
</script>

<style scoped>
#navbar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
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
  color: #cccccc;
  padding: 1rem;
}

a:visited {
  color:  #cccccc;
}

a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

a.active {
  color: white;
}
</style>
