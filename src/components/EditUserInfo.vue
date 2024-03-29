<template>
  <div v-if="sessionStore.username">
    <h1> {{ sessionStore.username }}</h1>
    <form @submit.prevent="submitForm">
      <div class="form-control">
        <label for="first-name">{{ $t('firstName') }}</label>
        <input
            id="first-name"
            name="first-name"
            type="text"
            v-model.trim="currentFirstName"
        />
      </div>
      <div class="form-control">
        <label for="last-name">{{ $t('lastName') }}</label>
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

      <div v-if="sessionStore.isCandidate">
        Candidate in {{ getElectionTitle() }}
      </div>

      <div class="form-control" v-if="sessionStore.isCandidate">
        <label for="candidate-number">{{ $t('candidateNumber') }}</label>
        <input
            id="candidate-number"
            name="candidate-number"
            type="text"
            v-model.number="currentCandidateNumber"
        />
      </div>

      <div class="form-control" v-if="showPartySelection()">
        <div><label for="select-party">{{ $t('party') }}</label></div>
        <div>
          <select id="select-party" name="parties" v-model="currentParty" :disabled="!allowEditParty()">
             <option value="">Choose your party</option>
             <option v-for="party in userGroupStore.parties" :value="party.name" :key="party.name">
               {{ party.title }}
             </option>
          </select>
        </div>
      </div>

      <div class="form-control" v-if="showDistrictSelection()">
        <div><label for="select-district">{{ $t('district') }}</label></div>
        <div>
          <select id="select-district" name="districts" v-model="currentDistrict" :disabled="!allowEditDistrict()">
             <option value="">Choose your district</option>
             <option v-for="district in userGroupStore.districts" :value="district.name" :key="district.name">
               {{ district.title }}
             </option>
          </select>
        </div>
      </div>

      <div class="form-control" v-if="sessionStore.isCandidate">
        <label for="homepage">{{ $t('homepage') }}</label>
        <input
            id="homepage"
            name="homepage"
            type="text"
            v-model.trim="currentHomepage"
        />
      </div>

      <div class="form-control">
        <div><label for="description">{{ $t('description') }}</label></div>
        <div>
          <textarea id="description" name="description" v-model="currentDescription" rows="10" cols="50">
          </textarea>
        </div>
      </div>
      <p>
        <button id="save-user-info-button" class="btn">{{ $t('save') }}</button>
      </p>
    </form>
    <p>
      <router-link id="user-view-link" :to="{ name: 'user-view' }">
        {{ $t('back') }}
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
const currentParty = ref('')
const currentDistrict = ref('')
const currentDescription = ref('')
const currentCandidateNumber = ref(0)
const currentHomepage = ref('')
const router = useRouter()

onBeforeMount(async () => {
  await EventService.fetchUserInfo()
  await EventService.fetchUserDescription()
  currentFirstName.value = sessionStore.firstName
  currentLastName.value = sessionStore.lastName
  currentEmail.value = sessionStore.email
  currentDescription.value = sessionStore.description
  if (userGroupStore.count === 0) {
    await EventService.fetchUserGroups()
  }
  currentCandidate.value = sessionStore.isCandidate
  if (sessionStore.party !== undefined) {
    currentParty.value = sessionStore.party.name
  }
  if (sessionStore.district !== undefined) {
    currentDistrict.value = sessionStore.district.name
  }
  currentCandidateNumber.value = sessionStore.candidateNumber
  currentHomepage.value = sessionStore.homepage
})

function allowEditParty() {
  return sessionStore.party === undefined
}

function allowEditDistrict() {
  return sessionStore.district === undefined
}

function submitForm() {
  console.log('Saving user info')
  sessionStore.firstName = currentFirstName.value
  sessionStore.lastName = currentLastName.value
  sessionStore.email = currentEmail.value
  sessionStore.candidateNumber = currentCandidateNumber.value
  sessionStore.homepage = currentHomepage.value
  sessionStore.description = currentDescription.value
  EventService.updateUserInfo()
  EventService.updateUserDescription()
  if (currentParty.value !== '') {
    if (sessionStore.party === undefined)  // Allow joining only one party
    {
      EventService.joinGroup(currentParty.value)
    }
  }
  if (currentDistrict.value !== '') {
    if (sessionStore.district === undefined) { // Allow joining only one district
      EventService.joinGroup(currentDistrict.value)
    }
  }
  EventService.fetchMemberships()
  router.push({ name: 'user-view' })
}

function showPartySelection() {
  if (sessionStore.isCandidate) {
    if (userGroupStore.parties.length > 0) {
        return true
    }
  }
  return false
}

function showDistrictSelection() {
  if (sessionStore.isCandidate) {
    if (userGroupStore.districts.length > 0) {
        return true
    }
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
