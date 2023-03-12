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

      <div class="form-control" v-if="showCandidateCheckbox()">
        <label for="candidate">Are you a candidate in this election: {{ getElectionTitle() }}?</label>
        <input
          id="candidate"
          name="candidate"
          type="checkbox"
          v-model="currentCandidate"
        />
      </div>

      <p>
        <button id="save-user-info-button" class="btn">Save</button>
      </p>
    </form>
    <p>
      <router-link id="user-view-link" :to="{ name: 'user-view' }">
        Back
      </router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { EventService } from '../services/EventService'
import { useSessionStore } from '../stores/SessionStore'
import { useUserGroupStore } from '../stores/UserGroupStore'

const sessionStore = useSessionStore()
const userGroupStore = useUserGroupStore()
const currentFirstName = ref('')
const currentLastName = ref('')
const currentEmail = ref('')
const currentCandidate = ref(false)
const router = useRouter()

onBeforeMount(() => {
  currentFirstName.value = sessionStore.firstName
  currentLastName.value = sessionStore.lastName
  currentEmail.value = sessionStore.email
  currentCandidate.value = sessionStore.isCandidate
})

function submitForm() {
  console.log('Saving user info')
  sessionStore.firstName = currentFirstName.value
  sessionStore.lastName = currentLastName.value
  sessionStore.email = currentEmail.value
  EventService.updateUserInfo()
  router.push({ name: 'user-view' })
}

function showCandidateCheckbox() {
  if (userGroupStore.hasElections) {
    return true
  }
  return false
}

function getElectionTitle() {
  return userGroupStore.getElectionTitle()
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
