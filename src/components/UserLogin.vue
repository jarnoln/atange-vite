<template>
  <h1 style="text-transform: capitalize"> {{ getTitle() }} </h1>
  <form @submit.prevent="submitForm">
    <div class="form-control" :class="{ invalid: usernameValidateError }">
      <label for="user-name">Name</label>
      <input
          id="user-name"
          name="user-name"
          type="text"
          v-model.trim="currentUsername"
          @blur="validateUsername"
      />
      <p v-if="usernameValidateError">{{ usernameValidateError }}</p>
    </div>
    <div class="form-control" :class="{ invalid: passwordValidateError }">
      <label for="password">Password</label>
      <input
          id="password"
          name="password"
          type="password"
          v-model.trim="currentPassword"
          @input="validatePassword"
      />
      <p v-if="passwordValidateError">{{ passwordValidateError }}</p>
    </div>
    <button :disabled="!isFormValid()" style="text-transform: capitalize">{{ getTitle() }}</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useSessionStore } from '../stores/SessionStore'
import { validateStringLongEnough, validateStringNotDuplicate } from '../utils/validators'
import { login, register } from '../services/EventService'

const currentUsername = ref('')
const currentPassword = ref('')
const usernameValidateError = ref('')
const passwordValidateError = ref('')
const isUsernameValidated = ref(false)
const isPasswordValidated = ref(false)
const sessionStore = useSessionStore()
const route = useRoute()

function getTitle() {
  return route.name
}

function submitForm() {
  console.log(route.name, currentUsername.value, currentPassword.value)
  if (route.name === 'register') {
      sessionStore.registerInProgress = true
      register(currentUsername.value, currentPassword.value)
  } else {
      sessionStore.loginInProgress = true
      login(currentUsername.value, currentPassword.value)
  }
  // router.push({ name: 'collective', params: { collectiveName: currentName.value }})
}

function validateUsername() {
  console.log('validateUsername:', currentUsername.value)
  if (route.name === 'register') {
    usernameValidateError.value = validateStringLongEnough('Username', currentUsername.value, 3)
  }
  isUsernameValidated.value = true
}

function validatePassword() {
  console.log('validatePassword:', currentPassword.value)
  if (route.name === 'register') {
    passwordValidateError.value = validateStringLongEnough('Password', currentPassword.value, 6)
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