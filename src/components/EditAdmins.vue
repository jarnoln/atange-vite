<template>
  <div v-if="collectiveStore.currentCollective && canEdit">
    <h2>Admins</h2>
    <p v-if="collectiveStore.admins.length === 0">
      None
    </p>
    <p v-else>
      <ul>
        <li v-for="admin in collectiveStore.admins" :key="admin">
          {{ admin }}
        </li>
      </ul>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import slugify from 'slugify'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { useSessionStore } from '../stores/SessionStore'
import { EventService } from '../services/EventService'

const collectiveStore = useCollectiveStore()
const sessionStore = useSessionStore()
const router = useRouter()

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

const isFormValid = computed(() => {
  return true
})

function submitForm() {
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
