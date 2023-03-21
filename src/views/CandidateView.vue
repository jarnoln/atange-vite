<template>
  <div v-if="candidate">
    <h1>{{ candidate.firstName }} {{ candidate.lastName }}</h1>
    <table>
      <tr v-if="candidate.party">
        <th>Party</th>
        <td>{{ candidate.party.title }}</td>
      </tr>
      <tr v-if="candidate.district">
        <th>District</th>
        <td>{{ candidate.district.title }}</td>
      </tr>
      <tr v-if="candidate.candidateNumber">
        <th>Number</th>
        <td>{{ candidate.candidateNumber }}</td>
      </tr>
      <tr v-if="candidate.homepage">
        <th>Home page</th>
        <td><a :href="candidate.homepage">{{ candidate.homepage }}</a></td>
      </tr>
      <tr v-if="candidate.description">
        <th colspan="2">Description</th>
      </tr>
      <tr v-if="candidate.description">
        <td colspan="2">{{ candidate.description }}</td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { EventService } from '../services/EventService'
import { useUserGroupStore } from '../stores/UserGroupStore'

const props = defineProps<{
  candidateName: string
}>()

const userGroupStore = useUserGroupStore()
const candidate = ref(userGroupStore.getEmptyCandidate())

onBeforeMount(async () => {
  if (!userGroupStore.loaded) {
    await EventService.fetchUserGroups()
    await EventService.fetchAllUserGroupMembers()
  }
  if (userGroupStore.candidates.length === 0) {
    await EventService.fetchCandidates()
  }
  const currentCandidate = userGroupStore.getCandidate(props.candidateName)
  if (currentCandidate) {
    candidate.value = currentCandidate
  }
  console.log('CandidateView:candidate:', candidate)
})

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
