<template>
  <form @submit.prevent="submitForm">
    <div v-if="!questionName" class="form-control" :class="{ invalid: nameValidateError }">
      <label for="question-name">Name</label>
      <input
          id="question-name"
          name="question-name"
          type="text"
          minlength="1"
          v-model.trim="currentName"
          @input="validateName"
      />
      <p v-if="nameValidateError">{{ nameValidateError }}</p>
    </div>
    <div class="form-control" :class="{ invalid: titleValidateError }">
      <label for="question-title">Title</label>
      <input
          id="question-title"
          name="question-title"
          type="text"
          minlength="3"
          required
          v-model.trim="currentTitle"
          @input="validateTitle"
      />
      <p v-if="titleValidateError">{{ titleValidateError }}</p>
    </div>
    <div class="form-control">
      <label for="question-description">Description</label>
      <input
          id="question-description"
          name="question-description"
          type="text"
          v-model.trim="currentDescription"
      />
    </div>
    <p>
      <button id="question-submit-button" :disabled="!isFormValid">
        {{ submitButtonText }}
      </button>
    </p>
    <p>
      <button id="question-delete-button" v-if="props.questionName" @click="deleteQuestion">Delete</button>
    </p>

  </form>
  <p v-if="collectiveStore.currentCollective">
    <router-link :to="{ name: 'collective', params: { collectiveName: collectiveStore.currentCollective.name }}">Back</router-link>
  </p>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { useQuestionStore } from '../stores/QuestionStore'
import { validateStringLongEnough, validateStringNotDuplicate } from '../utils/validators'
import { EventService } from '../services/EventService'

const props = defineProps<{
  questionName: string
}>()

const currentName = ref('')
const currentTitle = ref('')
const currentDescription = ref('')
const nameValidateError = ref('')
const titleValidateError = ref('')
const isNameValidated = ref(false)
const isTitleValidated = ref(false)
const questionStore = useQuestionStore()
const collectiveStore = useCollectiveStore()
const router = useRouter()

onMounted(() => {
  console.log('EditQuestion:onMounted', props.questionName)
  if (props.questionName != '') {
    const question = questionStore.getQuestion(props.questionName)
    if (question != undefined) {
      currentName.value = question.name
      currentTitle.value = question.title
      currentDescription.value = question.description
      validateName()
      validateTitle()
    }
  }
})

const submitButtonText = computed(() => {
  if (props.questionName === '') {
    return 'Create'
  } else {
    return 'Save'
  }
})

const isFormValid = computed(() => {
  console.log('isFormValid', props.questionName, isNameValidated.value, isTitleValidated.value)
  if (props.questionName === '') {
    if (isNameValidated.value === false || nameValidateError.value !== '') {
      return false
    }
  }
  if (isTitleValidated.value === false || titleValidateError.value !== '') {
    return false
  }
  return true
})

function validateName() {
  console.log('validateName:', currentName.value)
  nameValidateError.value = validateStringLongEnough('Name', currentName.value, 1)
  if (nameValidateError.value === '') {
    const questionNames = questionStore.questionNames
    console.log('questionNames', questionNames)
    nameValidateError.value = validateStringNotDuplicate(currentName.value, questionNames)
  }
  isNameValidated.value = true
}

function validateTitle() {
  titleValidateError.value = validateStringLongEnough('Title', currentTitle.value, 3)
  isTitleValidated.value = true
}

function submitForm() {
  if (props.questionName) {
    questionStore.updateQuestion(props.questionName, currentTitle.value, currentDescription.value)
  } else {
    questionStore.addQuestion(currentName.value, currentTitle.value, currentDescription.value)
    // Get question from store so that it has proper default attributes when sending it to backend
    const question = questionStore.getQuestion(currentName.value)
    if (question != undefined) {
      EventService.createQuestion(question)
    }
  }
  if (collectiveStore.currentCollective) {
    router.push({ name: 'collective-view', params: { collectiveName: collectiveStore.currentCollective.name }})
  }
}

function deleteQuestion() {
  if (props.questionName) {
    questionStore.deleteQuestion(props.questionName)
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

input {
  display: block;
}
</style>
