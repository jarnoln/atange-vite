<template>
  <div v-if="canEdit">
    <h2 id="edit-question-title"> {{ titleText }}</h2>
    <form @submit.prevent="submitForm">
      <div class="form-control" :class="{ invalid: titleValidateError }">
        <label for="question-title">Title</label>
        <input
            id="question-title"
            name="question-title"
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
        <label for="question-description">Description</label>
        <textarea
            id="question-description"
            name="question-description"
            v-model.trim="currentDescription"
            rows="10"
            cols="60"
        />
      </div>
      <div v-show="isNameInputShown" v-if="!questionName" class="form-control" :class="{ invalid: nameValidateError }">
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
      <p>
        <button class="btn" id="question-submit-button" :disabled="!isFormValid">
          {{ submitButtonText }}
        </button>
      </p>
    </form>
    <p>
      <button
          v-if="!questionName"
          class="btn"
          id="toggle-show-name-edit-button"
          @click="isNameInputShown = !isNameInputShown"
      >
        {{ nameEditToggleButtonText }}
      </button>
    </p>
    <p>
      <button
          v-if="props.questionName"
          id="question-delete-button"
          class="btn btn-danger"
          @click="deleteQuestion"
      >Delete</button>
    </p>
    <p v-if="collectiveStore.currentCollective">
      <router-link :to="{ name: 'collective-view', params: { collectiveName: collectiveStore.currentCollective.name }}">Back</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import slugify from 'slugify'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { useQuestionStore } from '../stores/QuestionStore'
import { useSessionStore } from '../stores/SessionStore'
import { validateStringLongEnough, validateStringNotDuplicate, validateStringSlugified } from '../utils/validators'
import { EventService } from '../services/EventService'

const props = defineProps<{
  questionName?: string,
  itemType?: string
}>()

const currentName = ref('')
const currentTitle = ref('')
const currentDescription = ref('')
const nameValidateError = ref('')
const titleValidateError = ref('')
const isNameValidated = ref(false)
const isTitleValidated = ref(false)
const isNameInputShown = ref(false)
const collectiveStore = useCollectiveStore()
const questionStore = useQuestionStore()
const sessionStore = useSessionStore()
const router = useRouter()

onMounted(() => {
  console.log('EditQuestion:onMounted', props.questionName)
  if (props.questionName != undefined) {
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

const canEdit = computed(() => {
  if (!sessionStore.isLoggedIn) {
    return false
  }
  if (collectiveStore.currentCollective) {
    return collectiveStore.currentCollective.permissions.canEdit
  } else {
    return false
  }
})

const titleText = computed(() => {
  console.log('questioName', props.questionName, 'itemType:', props.itemType)
  if (props.questionName != undefined) {
    const question = questionStore.getQuestion(props.questionName)
    if (question && question.itemType === 'header') {
      return 'Edit header'
    } else {
      return 'Edit question'
    }
  }
  if (props.itemType === 'header') {
    return 'Add header'
  }
  return 'Add question'
})

const submitButtonText = computed(() => {
  if (props.questionName === undefined) {
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

const isFormValid = computed(() => {
  console.log('isFormValid', props.questionName, isNameValidated.value, isTitleValidated.value)
  if (props.questionName === undefined) {
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
  if (props.questionName === undefined) {
    currentName.value = slugify(newValue, { lower: true, strict: true })
    console.log('currentName', currentName.value)
    validateName()
  }
})

function validateName() {
  // console.log('validateName:', currentName.value)
  nameValidateError.value = validateStringLongEnough('Name', currentName.value, 1)
  if (nameValidateError.value === '') {
    nameValidateError.value = validateStringSlugified('Name', currentName.value)
  }
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
  console.log('submitForm')
  if (props.questionName) {
    questionStore.updateQuestion(props.questionName, currentTitle.value, currentDescription.value)
    const question = questionStore.getQuestion(props.questionName)
    // Get updated question from store so that it has proper default attributes when sending it to backend
    if (question != undefined) {
      EventService.updateQuestion(props.questionName, question)
    }
  } else {
    questionStore.addQuestion(currentName.value, currentTitle.value, currentDescription.value, props.itemType)
    // Get created question from store so that it has proper default attributes when sending it to backend
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
    EventService.deleteQuestion(props.questionName)
    if (collectiveStore.currentCollective) {
      router.push({ name: 'collective-view', params: { collectiveName: collectiveStore.currentCollective.name }})
    }
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
