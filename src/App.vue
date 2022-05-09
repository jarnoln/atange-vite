<template>
  <nav id="navbar">
    <ul classid="right-links">
      <li>
        <router-link active-class="active" to="/">Home</router-link>
      </li>
    </ul>
    <ul id="left-links">
      <li>
        <router-link active-class="active" to="/login">Login</router-link>
      </li>
      <li>
        <router-link active-class="active" to="/register">Register</router-link>
      </li>
    </ul>
  </nav>
  <div id="notifications" :class="notificationsClasses">
    {{ getNotification() }}
  </div>
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSessionStore } from './stores/SessionStore';

const sessionStore = useSessionStore()
const notificationsClasses = ref(['invisible'])

function getNotification() {
  if (sessionStore.registerInProgress) {
    notificationsClasses.value = ['green']
    return 'Registering...'
  }
  if (sessionStore.loginInProgress) {
    notificationsClasses.value = ['green']
    return 'Logging in...'
  }
  notificationsClasses.value = ['invisible']
  return 'Placeholder'
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

#notifications.green {
  color: #003300;
  background-color: #bbffbb;
}
#notifications.invisible {
  color: rgba(0, 0, 0, 0);
  background-color:rgba(0, 0, 0, 0);
}
</style>
