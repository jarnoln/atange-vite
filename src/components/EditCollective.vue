<template>
  <div v-if="canEdit">
    <form @submit.prevent="submitForm">
      <div class="form-control" :class="{ invalid: titleValidateError }">
        <label for="collective-title">Title</label>
        <input
            id="collective-title"
            name="collective-title"
            type="text"
            minlength="3"
            size="50"
            required
            v-model.trim="currentTitle"
            @input="validateTitle"
        />
        <p v-if="titleValidateError">{{ titleValidateError }}</p>
      </div>
      <div class="form-control">
        <label for="collective-description">Description</label>
        <textarea
            id="collective-description"
            name="collective-description"
            v-model.trim="currentDescription"
            rows="10"
            cols="60"
        />
      </div>
      <div v-show="isNameInputShown" v-if="collectiveStore.currentCollective === undefined" class="form-control" :class="{ invalid: nameValidateError }">
        <label for="collective-name">Name</label>
        <input
            id="collective-name"
            name="collective-name"
            type="text"
            minlength="1"
            v-model.trim="currentName"
            @input="validateName"
        />
        <p v-if="nameValidateError">{{ nameValidateError }}</p>
      </div>
      <button id="collective-submit-button" class="btn" :disabled="!isFormValid">
        {{ submitButtonText }}
      </button>
      <button id="cancel-btn" class="btn" @click="userCancelled()">Cancel
      </button>
    </form>
    <p>
      <button
          v-if="!collectiveStore.currentCollective"
          class="btn"
          id="toggle-show-name-edit-button"
          @click="isNameInputShown = !isNameInputShown">
        {{ nameEditToggleButtonText }}
      </button>
    </p>
    <p v-if="showDeleteButton">
      <button id="delete-collective-btn" class="btn btn-danger" @click="deleteSelectedCollective">Delete collective</button>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import slugify from 'slugify'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { useSessionStore } from '../stores/SessionStore'
import { validateStringLongEnough, validateStringNotDuplicate, validateStringSlugified } from '../utils/validators'
import { EventService } from '../services/EventService'

const currentName = ref('')
const currentTitle = ref('')
const currentDescription = ref('')
const nameValidateError = ref('')
const titleValidateError = ref('')
const isNameValidated = ref(false)
const isTitleValidated = ref(false)
const isNameInputShown = ref(false)
const collectiveStore = useCollectiveStore()
const sessionStore = useSessionStore()
const router = useRouter()

onMounted(() => {
  if (collectiveStore.currentCollective != undefined) {
    currentName.value = collectiveStore.currentCollective.name
    currentTitle.value = collectiveStore.currentCollective.title
    currentDescription.value = collectiveStore.currentCollective.description
    validateName()
    validateTitle()
  }
})

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

const showDeleteButton = computed(() => {
  if (collectiveStore.currentCollective === undefined) {
    return false
  }
  if (sessionStore.username === collectiveStore.currentCollective.creator) {
    return true
  }
  return false
})

const submitButtonText = computed(() => {
  if (collectiveStore.currentCollective === undefined) {
    return 'Create'
  } else {
    return 'Save'
  }
})

const nameEditToggleButtonText = computed(() => {
  if (isNameInputShown.value) {
    return 'Hide name input'
  } else {
    return 'Show name input'
  }
})

function validateName() {
  console.log('validateName:', currentName.value)
  nameValidateError.value = validateStringLongEnough('Name', currentName.value, 1)
  if (nameValidateError.value === '') {
    nameValidateError.value = validateStringSlugified('Name', currentName.value)
  }
  if (nameValidateError.value === '') {
    const collectiveNames = collectiveStore.collectives.map(collective => collective.name)
    console.log('collectiveNames', collectiveNames)
    nameValidateError.value = validateStringNotDuplicate(currentName.value, collectiveNames)
  }
  isNameValidated.value = true
}

function validateTitle() {
  // console.log('validateTitle:', currentTitle.value)
  titleValidateError.value = validateStringLongEnough('Title', currentTitle.value, 3)
  isTitleValidated.value = true
}

const isFormValid = computed(() => {
  if (collectiveStore.currentCollective === undefined) {
    if (isNameValidated.value === false || nameValidateError.value !== '') {
      return false
    }
  }
  if (isTitleValidated.value === false || titleValidateError.value !== '') {
    return false
  }
  return true
})

watch(currentTitle, function(newValue) {
  if (collectiveStore.currentCollective === undefined) {
    currentName.value = slugify(newValue, { lower: true, strict: true })
    validateName()
  }
})

function submitForm() {
  console.log('EditCollective::submitForm', currentName.value, currentTitle.value)
  if (collectiveStore.currentCollective != undefined) {
    collectiveStore.updateCurrentCollective(currentTitle.value, currentDescription.value)
    EventService.updateCollective(collectiveStore.currentCollective)
  } else {
    collectiveStore.addCollective(
      currentName.value, currentTitle.value, currentDescription.value, sessionStore.username)
    EventService.createCollective(currentName.value, currentTitle.value, currentDescription.value)
  }
  router.push({ name: 'collective-view', params: { collectiveName: currentName.value }})
}

function userCancelled() {
  if (collectiveStore.currentCollective) {
    router.push({ name: 'collective-view', params: { collectiveName: collectiveStore.currentCollective.name }})
  } else {
    router.push({ name: 'home' })
  }
}

function deleteSelectedCollective() {
  const collective = collectiveStore.currentCollective
  if (collective) {
    collectiveStore.deleteCollective(collective.name)
    EventService.deleteCollective(collective)
    router.push({ name: 'home' })
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
