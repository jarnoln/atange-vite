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

      <div class="form-control" v-if="showPartySelection()">
        <div><label for="select-party">Party</label></div>
        <div>
          <select id="select-party" name="parties" v-model="currentParty">
             <option value="">Choose your party</option>
             <option v-for="party in userGroupStore.parties" :value="party.name" :key="party.name">
               {{ party.title }}
             </option>
          </select>
        </div>
      </div>

      <div class="form-control" v-if="showDistrictSelection()">
        <div><label for="select-district">District</label></div>
        <div>
          <select id="select-district" name="districts" v-model="currentDistrict">
             <option value="">Choose your district</option>
             <option v-for="district in userGroupStore.districts" :value="district.name" :key="district.name">
               {{ district.title }}
             </option>
          </select>
        </div>
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
const currentParty = ref('')
const currentDistrict = ref('')
const router = useRouter()


onBeforeMount(async () => {
  currentFirstName.value = sessionStore.firstName
  currentLastName.value = sessionStore.lastName
  currentEmail.value = sessionStore.email
  currentCandidate.value = sessionStore.isCandidate
  currentParty.value = sessionStore.party
  if (userGroupStore.count === 0) {
    await EventService.fetchUserGroups()
  }
})

function submitForm() {
  console.log('Saving user info')
  sessionStore.firstName = currentFirstName.value
  sessionStore.lastName = currentLastName.value
  sessionStore.email = currentEmail.value
  EventService.updateUserInfo()
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
  router.push({ name: 'user-view' })
}

function showCandidateCheckbox() {
  if (userGroupStore.hasElections) {
    return true
  }
  return false
}

function showPartySelection() {
  if (currentCandidate.value) {
    if (userGroupStore.parties.length > 0) {
        return true
    }
  }
  return false
}

function showDistrictSelection() {
  if (currentCandidate.value) {
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
