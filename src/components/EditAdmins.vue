<template>
  <div v-if="collectiveStore.currentCollective && canEdit">
    <h2>Admins</h2>
    <p v-if="collectiveStore.admins.length === 0">
      None
    </p>
    <p v-else>
      <ul>
        <li v-for="admin in collectiveStore.admins" :key="admin">
          {{ admin }} <button class="btn" :id="'btn-kick-' + admin" style="padding: 0.1rem 2rem; margin: 0.2rem" @click="kickAdmin(admin)">Kick</button>
        </li>
      </ul>
    </p>
    <p>
      <form id="add-admin-form" @submit.prevent="submitForm">
        <div class="form-control" :class="{ invalid: usernameValidateError }">
          <label for="admin-username">New admin username</label>
          <input
              id="admin-username"
              name="admin-username"
              type="text"
              minlength="3"
              size="50"
              required
              v-model.trim="currentUsername"
              @input="validateUsername"
          />
        </div>
        <button id="add-admin-button" :disabled="!isFormValid" class="btn" style="text-transform: capitalize">Add admin</button>
      </form>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { validateStringLongEnough, validateStringSlugified } from '../utils/validators'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { useSessionStore } from '../stores/SessionStore'
import { EventService } from '../services/EventService'

const collectiveStore = useCollectiveStore()
const sessionStore = useSessionStore()
const router = useRouter()
const currentUsername = ref('')
const isUsernameValidated = ref(false)
const usernameValidateError = ref('')

const canEdit = computed(() => {
  if (!sessionStore.isLoggedIn) {
    return false
  }
  if (collectiveStore.currentCollective) {
    return collectiveStore.currentCollective.permissions.canEdit
  } else {
    return true
  }
})

function validateUsername() {
  usernameValidateError.value = validateStringLongEnough('Username', currentUsername.value, 3)
  if (usernameValidateError.value === '') {
    usernameValidateError.value = validateStringSlugified('Username', currentUsername.value)
  }
  isUsernameValidated.value = true
}

const isFormValid = computed(() => {
  if (isUsernameValidated.value === false || usernameValidateError.value !== '') {
    return false
  }
  return true
})

async function submitForm() {
  console.log('Add admin:', currentUsername.value)
  const result = await EventService.addAdmin(currentUsername.value)
  if (result) {
    collectiveStore.addAdmin(currentUsername.value)
  }
}

async function kickAdmin(username: string) {
  console.log('Kick admin:', username)
  const result = await EventService.kickAdmin(username)
  if (result) {
    collectiveStore.kickAdmin(username)
  }
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

input, textarea {
  display: block;
}
</style>
