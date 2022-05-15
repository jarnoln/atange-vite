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
  <div id="notifications" :class="getNotificationClass()">
    {{ getNotificationMessage() }}
  </div>
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSessionStore } from './stores/SessionStore';
import { useNotificationStore } from './stores/NotificationStore';
import { serverLogout } from './services/EventService';

const sessionStore = useSessionStore()
const notificationStore = useNotificationStore()

function isLoggedIn() {
  return sessionStore.isLoggedIn
}

function getUsername() {
  return sessionStore.username
}

function logout() {
  serverLogout()
  sessionStore.logout()
}

function getNotificationMessage() {
  if (notificationStore.notifications.length === 0) {
    return 'Placeholder'
  } else {
    return notificationStore.notifications[0].message
  }
}

function getNotificationClass() {
  if (notificationStore.notifications.length === 0) {
    return 'invisible'
  } else {
    return notificationStore.notifications[0].class
  }
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

.container {
  margin-left: 4rem;
  margin-right: 4rem;
}

#notifications {
  padding: 5px;
}

#notifications.info {
  color: #000033;
  background-color: #bbbbff;
}
#notifications.success {
  color: #003300;
  background-color: #bbffbb;
}

#notifications.error {
  color: #330000;
  background-color: #f55;
}

#notifications.invisible {
  color: rgba(0, 0, 0, 0);
  background-color:rgba(0, 0, 0, 0);
}
</style>
