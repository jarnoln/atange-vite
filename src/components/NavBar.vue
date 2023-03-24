<template>
  <nav id="navbar" class="dark-background">
    <ul id="right-links">
      <li>
        <router-link id="navbar-home" active-class="active" :to="{ name: 'home' }">
          {{ $t('home') }}
        </router-link>
      </li>
      <li v-if="userGroupStore.hasElections && !settingsStore.oneCollective">
        <router-link id="navbar-candidates" active-class="active" :to="{ name: 'candidates' }">
          {{ $t('candidates') }}
        </router-link>
      </li>
      <li v-if="settingsStore.oneCollective">
        <router-link id="navbar-question-list" active-class="active" :to="{ name: 'question-list' }">
          {{ $t('questions') }}
        </router-link>
      </li>
      <li>
        <router-link id="navbar-about" active-class="active" :to="{ name: 'about' }">
          {{ $t('about') }}
        </router-link>
      </li>
    </ul>
    <ul id="left-links">
      <li v-if="!isLoggedIn()">
        <router-link id="navbar-login" active-class="active" :to="{ name: 'login' }">
          {{ $t('login') }}
        </router-link>
      </li>
      <li v-if="isLoggedIn()">
        <router-link id="navbar-edit-profile" :to="{ name: 'user-edit' }">
          {{ $t('editProfile') }}
        </router-link>
      </li>
      <li v-if="!isLoggedIn()">
        <router-link id="navbar-register" active-class="active" :to="{ name: 'register' }">
          {{ $t('register') }}
        </router-link>
      </li>
      <li v-if="isLoggedIn()">
        <router-link id="navbar-username" :to="{ name: 'user-view' }">
          {{ getUsername() }}
        </router-link>
      </li>
      <li v-if="isLoggedIn()">
        <a href="#" id="navbar-logout" @click="logout()">
          {{ $t('logout') }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useSessionStore } from '../stores/SessionStore'
import { useSettingsStore } from '../stores/SettingsStore';
import { useUserGroupStore } from '../stores/UserGroupStore'
import { EventService } from '../services/EventService'
import { onBeforeMount } from 'vue'

const sessionStore = useSessionStore()
const settingsStore = useSettingsStore()
const userGroupStore = useUserGroupStore()

onBeforeMount(() => {
  if (!userGroupStore.loaded) {
    EventService.fetchUserGroups()
  }
  if (!settingsStore.settingsLoaded) {
    EventService.fetchGlobalSettings()
  }
})

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
