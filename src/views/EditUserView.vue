<template>
  <div v-if="sessionStore.username">
    <h1> {{ sessionStore.username }}</h1>
    <form @submit.prevent="submitForm">
      <div class="form-control">
        <label for="first-name">First name</label>
        <input
            id="first-name"
            name="first-name"
            type="text"
            v-model.trim="currentFirstName"
        />
      </div>
      <div class="form-control">
        <label for="last-name">Last name</label>
        <input
            id="last-name"
            name="last-name"
            type="text"
            v-model.trim="currentLastName"
        />
      </div>
      <div class="form-control">
        <label for="email">Email</label>
        <input
            id="email"
            name="email"
            type="email"
            v-model.trim="currentEmail"
        />
      </div>
      <p>
        <button id="save-user-info-button" class="btn">Save</button>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EventService } from '../services/EventService'
import { useSessionStore } from '../stores/SessionStore'

const sessionStore = useSessionStore()
const currentFirstName = ref('')
const currentLastName = ref('')
const currentEmail = ref('')

function submitForm() {
  console.log('Save user info')
  // EventService.deleteCurrentUser(currentPassword.value)
}
</script>

<style scoped>
.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
}

input {
  display: block;
}
</style>
