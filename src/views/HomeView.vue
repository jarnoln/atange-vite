<template>
  <h1>Home</h1>
  <CollectiveList />
  <p>
  <router-link :to="{ name: 'create-collective' }">Create new collective</router-link>
  </p>
  <p>
    <button @click="fetchCollectives()">Fetch collectives</button>
  </p>
</template>

<script setup lang="ts">
import CollectiveList from '../components/CollectiveList.vue'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { Collective } from '../types'

const collectiveStore = useCollectiveStore()

function storeCollectives(collectiveData: Collective[]) {
  collectiveData.forEach(item => {
    collectiveStore.addCollective({
      name: item.name,
      title: item.title
    })
  });
}

function fetchCollectives() {
  const server: string = 'http://127.0.0.1:8000'
  const path: string = '/api/collectives/'
  const url = server + path
  fetch(url)
      .then(response => response.json())
      .then(data => storeCollectives(data))
}

</script>
