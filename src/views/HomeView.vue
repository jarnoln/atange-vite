<template>
  <CollectiveList v-if="!settingsStore.oneCollective"/>
  <CandidateList v-if="settingsStore.oneCollective"/>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'
import CollectiveList from '../components/CollectiveList.vue'
import CandidateList from '../components/CandidateList.vue'
import { useSettingsStore } from '../stores/SettingsStore';
import { EventService } from '../services/EventService';

const settingsStore = useSettingsStore()

onBeforeMount(() => {
  if (!settingsStore.settingsLoaded) {
    EventService.fetchGlobalSettings()
  }
})


</script>
