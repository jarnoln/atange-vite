<template>
  <div v-if="collectiveStore.currentCollective !== undefined">
    <h1 id="collective-title">{{ collectiveStore.currentCollective.title }}</h1>
    <!-- <p id="collective-description">{{ collectiveStore.currentCollective.description }}</p> -->
    <nav id="collective-navbar" class="dark-background" v-if="canEditCollective">
      <ul>
        <li>
          <router-link id="collective-view-link" :to="{ name: 'collective-view', params: { collectiveName: collectiveStore.currentCollective.name }}">
            Questions
          </router-link>
        </li>
        <li>
          <router-link id="collective-reorder-link" active-class="active" :to="{ name: 'collective-reorder', params: { collectiveName: collectiveStore.currentCollective.name }}">
            Reorder
          </router-link>
        </li>
        <li>
          <router-link id="collective-edit-link" active-class="active" :to="{ name: 'collective-edit', params: { collectiveName: collectiveStore.currentCollective.name }}">
            Edit
          </router-link>
        </li>
      </ul>
    </nav>
    <div id="collective-view-container">
      <router-view></router-view>
    </div>
  </div>
  <p v-else>Unknown collective</p>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { RouterLink } from 'vue-router'
import { onBeforeMount } from 'vue'
import { RouterView } from 'vue-router'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { useSessionStore } from '../stores/SessionStore'

import { EventService } from '../services/EventService'

const props = defineProps<{
  collectiveName: string
}>()

const collectiveStore = useCollectiveStore()
const sessionStore = useSessionStore()

onBeforeMount(async () => {
  console.log('CollectiveBaseView about to be mounted')
  if (collectiveStore.count === 0) {
    await EventService.fetchCollectives()
  }
  if ((props.collectiveName) && (props.collectiveName != collectiveStore.currentCollectiveName)) {
    collectiveStore.selectCollective(props.collectiveName)
    await EventService.fetchPermissions(props.collectiveName)
    await EventService.fetchQuestions(props.collectiveName)
    await EventService.fetchAdmins(props.collectiveName)
  }
})

const canEditCollective = computed(() => {
  if (collectiveStore.currentCollective) {
    if (sessionStore.isLoggedIn) {
      return collectiveStore.currentCollective.permissions.canEdit
    }
  }
  return false
})
</script>

<style scoped>
#collective-navbar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
}

ul {
  list-style: none;
  display: flex;
  padding-left: 1rem;
}

#left-links {
  padding-right: 2rem;
}

a {
  text-decoration: none;
  color: #cccccc;
  padding: 1rem;
}

a:visited {
  color:  #cccccc;
}

a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

a.active {
  color: white;
}
</style>
