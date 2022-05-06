<template>
  <form @submit.prevent="submitForm">
    <div class="form-control" :class="{ invalid: nameValidateError }">
      <label for="collective-name">Name</label>
      <input
          id="collective-name"
          name="collective-name"
          type="text"
          v-model.trim="currentName"
          @blur="validateName"
      />
      <p v-if="nameValidateError">{{ nameValidateError }}</p>
    </div>
    <div class="form-control" :class="{ invalid: titleValidateError }">
      <label for="collective-title">Title</label>
      <input
          id="collective-title"
          name="collective-title"
          type="text"
          v-model.trim="currentTitle"
          @input="validateTitle"
      />
      <p v-if="titleValidateError">{{ titleValidateError }}</p>
    </div>
    <button :disabled="!isFormValid()">Create</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { validateStringLongEnough } from '../utils/validators'

const currentName = ref('')
const currentTitle = ref('')
const nameValidateError = ref('')
const titleValidateError = ref('')
const isNameValidated = ref(false)
const isTitleValidated = ref(false)
const collectiveStore = useCollectiveStore()
const router = useRouter()

function submitForm() {
  console.log('Tadaa!', currentName.value, currentTitle.value)
  collectiveStore.addCollective({ name: currentName.value, title: currentTitle.value })
  router.push({ name: 'collective', params: { collectiveName: currentName.value }})
}

function validateName() {
  console.log('validateName:', currentName.value)
  nameValidateError.value = validateStringLongEnough('Name', currentName.value, 1)
  isNameValidated.value = true
}

function validateTitle() {
  console.log('validateTitle:', currentTitle.value)
  titleValidateError.value = validateStringLongEnough('Title', currentTitle.value, 3)
  isTitleValidated.value = true
}

function isFormValid() {
  if (isNameValidated.value === false || nameValidateError.value !== '') {
    return false
  }
  if (isTitleValidated.value === false || titleValidateError.value !== '') {
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