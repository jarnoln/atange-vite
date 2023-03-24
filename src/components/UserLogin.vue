<template>
  <h1 style="text-transform: capitalize; text-align: left;"> {{ $t(getTitle()) }} </h1>
  <form @submit.prevent="submitForm">
    <div class="form-control" :class="{ invalid: usernameValidateError }">
      <label for="user-name">{{ $t('username') }}</label>
      <input
          id="user-name"
          name="user-name"
          type="text"
          v-model.trim="currentUsername"
          @input="validateUsername"
      />
      <p v-if="usernameValidateError">{{ usernameValidateError }}</p>
    </div>
    <div class="form-control" :class="{ invalid: passwordValidateError }">
      <label for="password">{{ $t('password') }}</label>
      <input
          id="password"
          name="password"
          type="password"
          v-model.trim="currentPassword"
          @input="validatePassword"
      />
      <p v-if="passwordValidateError">{{ passwordValidateError }}</p>
    </div>
    <div class="form-control" v-if="showCandidateCheckbox()">
      <label for="candidate">{{ $t('areYouCandidateInThisElection') }}: {{ getElectionTitle() }}?</label>
      <input
          id="candidate"
          name="candidate"
          type="checkbox"
          v-model="currentCandidate"
      />
    </div>
    <button id="submit-button" :disabled="!isFormValid()" class="btn" style="text-transform: capitalize">
      {{ $t(getTitle()) }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { validateStringLongEnough, validateStringSlugified } from '../utils/validators'
import { EventService } from '../services/EventService'
import { useNotificationStore } from '../stores/NotificationStore'
import { useUserGroupStore } from '../stores/UserGroupStore'
import { useSessionStore } from '../stores/SessionStore'

const currentUsername = ref('')
const currentPassword = ref('')
const currentCandidate = ref(false)
const usernameValidateError = ref('')
const passwordValidateError = ref('')
const isUsernameValidated = ref(false)
const isPasswordValidated = ref(false)
const route = useRoute()
const router = useRouter()


onBeforeMount(async () => {
  console.log('UserLogin about to be mounted')
  const userGroupStore = useUserGroupStore()
  if (userGroupStore.count === 0) {
    await EventService.fetchUserGroups()
  }
})

function getTitle() {
  if (route.name === null || route.name === undefined) {
    return ''
  } else {
    return route.name
  }
}

async function submitForm() {
  console.log(route.name, currentUsername.value, currentPassword.value)
  const isRegistering = route.name === 'register'
  if (isRegistering) {
      const notificationStore = useNotificationStore()
      await EventService.register(currentUsername.value, currentPassword.value)
      if (notificationStore.latestNotification.id === 'registered') {
        console.log('Registration successful. Logging in automatically.')
        await EventService.login(currentUsername.value, currentPassword.value)
        EventService.fetchUserInfo()
        EventService.fetchMemberships()
      }
  } else {
      await EventService.login(currentUsername.value, currentPassword.value)
      EventService.fetchUserInfo()
      EventService.fetchUserDescription()
      EventService.fetchMemberships()
  }
  const sessionStore = useSessionStore()
  if (currentCandidate.value === true) {
    // Add user to election as candidate
    if (sessionStore.isLoggedIn) {
      const userGroupStore = useUserGroupStore()
      const electionName = userGroupStore.getElectionName()
      if (electionName !== '') {
        await EventService.joinGroup(electionName)
        EventService.fetchMemberships()
      }
    }
  }
  if (sessionStore.isLoggedIn) {
    if (isRegistering) {
      // If registration and login were successful, move to page for editing user information
      router.push({ name: 'user-edit' })
    } else {
      router.push({ name: 'home' })
    }
  }
}

function validateUsername() {
  if (route.name === 'register') {
    usernameValidateError.value = validateStringLongEnough('Username', currentUsername.value, 3)
    if (usernameValidateError.value === '') {
      usernameValidateError.value = validateStringSlugified('Username', currentUsername.value)
    }
  }
  isUsernameValidated.value = true
}

function validatePassword() {
  if (route.name === 'register') {
    passwordValidateError.value = validateStringLongEnough('Password', currentPassword.value, 8)
  }
  isPasswordValidated.value = true
}

function isFormValid() {
  if (isUsernameValidated.value === false || usernameValidateError.value !== '') {
    return false
  }
  if (isPasswordValidated.value === false || passwordValidateError.value !== '') {
    return false
  }
  return true
}

function showCandidateCheckbox() {
  if (route.name === 'register') {
    const userGroupStore = useUserGroupStore()
    if (userGroupStore.hasElections) {
      return true
    }
  }
  return false
}

function getElectionTitle() {
  const userGroupStore = useUserGroupStore()
  return userGroupStore.getElectionTitle()
}
</script>

<style scoped>
.form-control {
  margin: 0.5rem 0;
}

.form-control.invalid input {
  border-color: red;
}

label {
  font-weight: bold;
}

.form-control.invalid label {
  color: red;
}

input {
  display: block;
}
</style>
