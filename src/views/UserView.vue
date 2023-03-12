<template>
  <div v-if="sessionStore.username">
    <h1>{{ sessionStore.username }}</h1>
    <table>
      <tr>
        <th>First name</th>
        <td>{{ sessionStore.firstName }}</td>
      </tr>
      <tr>
        <th>Last name</th>
        <td>{{ sessionStore.lastName }}</td>
      </tr>
      <tr>
        <th>Email</th>
        <td>{{ sessionStore.email }}</td>
      </tr>
      <tr v-if="sessionStore.party">
        <th>Party</th>
        <td>{{ sessionStore.party.title }}</td>
      </tr>
      <tr v-if="sessionStore.district">
        <th>District</th>
        <td>{{ sessionStore.district.title }}</td>
      </tr>
    </table>
    <p v-if="sessionStore.memberships.length > 0">
      Memberships:
      <ul>
        <li v-for="membership in sessionStore.memberships" :key="membership.name">
          {{ membership.title }}
        </li>
      </ul>
    </p>
    <p>
      <router-link id="edit-user-link" :to="{ name: 'user-edit' }">
        Edit user information
      </router-link>
    </p>
    <h2> Deleting account</h2>
    <p>Warning: Deleting account is irreversible action. When it is gone it is gone, no backsies.</p>
    <form @submit.prevent="submitForm">
      <div class="form-control">
        <label for="password">Password</label>
        <input
            id="password"
            name="password"
            type="password"
            v-model.trim="currentPassword"
        />
      </div>
      <p>
        <button id="delete-user-button" class="btn btn-danger" :disabled="!currentPassword">Delete account</button>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EventService } from '../services/EventService'
import { useSessionStore } from '../stores/SessionStore'

const sessionStore = useSessionStore()
const currentPassword = ref('')

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
