<template>
  <div v-if="collectiveStore.selectedCollective !== undefined">
    <h1 id="collective-title"> {{ collectiveStore.selectedCollective.title }} </h1>
  </div>
  <p v-else>Unknown collective</p>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
// import { useRoute } from 'vue-router'
import { useCollectiveStore } from '../stores/CollectiveStore'

const props = defineProps<{
  collectiveName: string
}>()

const collectiveStore = useCollectiveStore()
collectiveStore.addExampleCollectives()
// const route = useRoute()

onMounted(() => {
    // const collectiveName = route.params.collectiveName as string
    collectiveStore.selectCollective(props.collectiveName)
})

</script>
