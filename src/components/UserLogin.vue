<template>
  <h1 style="text-transform: capitalize; text-align: left;"> {{ getTitle() }} </h1>
  <form @submit.prevent="submitForm">
    <div class="form-control" :class="{ invalid: usernameValidateError }">
      <label for="user-name">Name</label>
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
    <button id="submit-button" :disabled="!isFormValid()" class="btn" style="text-transform: capitalize">{{ getTitle() }}</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { validateStringLongEnough, validateStringSlugified } from '../utils/validators'
import { EventService } from '../services/EventService'

const currentUsername = ref('')
const currentPassword = ref('')
const usernameValidateError = ref('')
const passwordValidateError = ref('')
const isUsernameValidated = ref(false)
const isPasswordValidated = ref(false)
const route = useRoute()
const router = useRouter()

function getTitle() {
  return route.name
}

async function submitForm() {
  console.log(route.name, currentUsername.value, currentPassword.value)
  if (route.name === 'register') {
      await EventService.register(currentUsername.value, currentPassword.value)
      await EventService.login(currentUsername.value, currentPassword.value)
      EventService.fetchUserInfo()
  } else {
      await EventService.login(currentUsername.value, currentPassword.value)
      EventService.fetchUserInfo()
  }
  router.push({ name: 'home' })
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
