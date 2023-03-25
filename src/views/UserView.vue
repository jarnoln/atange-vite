<template>
  <div v-if="sessionStore.username">
    <h1>{{ sessionStore.username }}</h1>
    <table>
      <tr>
        <th>{{ $t('firstName') }}</th>
        <td>{{ sessionStore.firstName }}</td>
      </tr>
      <tr>
        <th>{{ $t('lastName') }}</th>
        <td>{{ sessionStore.lastName }}</td>
      </tr>
      <tr v-if="sessionStore.isCandidate">
        <th>Candidate in </th>
        <td>{{ sessionStore.electionTitle }}</td>
      </tr>
      <tr v-if="sessionStore.party">
        <th>{{ $t('party') }}</th>
        <td>{{ sessionStore.party.title }}</td>
      </tr>
      <tr v-if="sessionStore.district">
        <th>{{ $t('district') }}</th>
        <td>{{ sessionStore.district.title }}</td>
      </tr>
      <tr v-if="sessionStore.candidateNumber">
        <th>{{ $t('candidateNumber') }}</th>
        <td>{{ sessionStore.candidateNumber }}</td>
      </tr>
      <tr v-if="sessionStore.homepage">
        <th>{{ $t('homepage') }}</th>
        <td><a :href="sessionStore.homepage">{{ sessionStore.homepage }}</a></td>
      </tr>
      <tr v-if="sessionStore.description">
        <th colspan="2">{{ $t('description') }}</th>
      </tr>
      <tr v-if="sessionStore.description">
        <td colspan="2">{{ sessionStore.description }}</td>
      </tr>
    </table>
    <!-- <p v-if="sessionStore.memberships.length > 0">
      Memberships:
      <ul>
        <li v-for="membership in sessionStore.memberships" :key="membership.name">
          {{ membership.title }}
        </li>
      </ul>
    </p> -->
    <p>
      <router-link id="edit-user-link" :to="{ name: 'user-edit' }">
        {{ $t('editUserInfo') }}
      </router-link>
    </p>
    <h2>{{ $t('deletingAccount') }}</h2>
    <p>{{ $t('deletingAccountWarning') }}</p>
    <form @submit.prevent="submitForm">
      <div class="form-control">
        <label for="password">{{ $t('password') }}</label>
        <input
            id="password"
            name="password"
            type="password"
            v-model.trim="currentPassword"
        />
      </div>
      <p>
        <button id="delete-user-button" class="btn btn-danger" :disabled="!currentPassword">
          {{ $t('deleteAccount') }}
        </button>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { EventService } from '../services/EventService'
import { useSessionStore } from '../stores/SessionStore'

const sessionStore = useSessionStore()
const currentPassword = ref('')

onBeforeMount(async () => {
  await EventService.fetchUserInfo()
  await EventService.fetchUserDescription()
})

function submitForm() {
  console.log('Deleting user')
  EventService.deleteCurrentUser(currentPassword.value)
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
