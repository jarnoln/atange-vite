<template>
  <p id="collective-description" v-if="collectiveStore.currentCollective">
    {{ collectiveStore.currentCollective.description }}
  </p>
  <question-list></question-list>
</template>

<script setup lang="ts">
//  Shows question list when there is only one collective (and hence no need to specify collective in path)
import QuestionList from '../components/QuestionList.vue'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { onBeforeMount } from 'vue'
import { EventService } from '../services/EventService'

const collectiveStore = useCollectiveStore()

onBeforeMount(async () => {
  if (collectiveStore.count === 0) {
    await EventService.fetchCollectives()
    await EventService.fetchUserGroups()
  }
  if (collectiveStore.count === 1) {
    if (collectiveStore.currentCollectiveName === '') {
      const collectiveName = collectiveStore.collectives[0].name
      collectiveStore.selectCollective(collectiveName)
      await EventService.fetchPermissions(collectiveName)
      await EventService.fetchQuestions(collectiveName)
      await EventService.fetchAdmins(collectiveName)
    }
  } else {
    console.log('QuestionListView should be used only when there is only one collective')
  }
})

</script>
