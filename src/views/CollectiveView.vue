<template>
  <div v-if="collectiveStore.currentCollective !== undefined">
    <table>
      <thead>
        <tr>
          <th>Questions: {{ questionStore.count }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="question in questionStore.questions">
          <td> {{ question.title }} </td>
          <td v-if=" collectiveStore.currentCollective">
            <router-link
              :to="{ name: 'question-edit', params: { collectiveName: collectiveStore.currentCollective.name, questionName: question.name }}">
                Edit
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCollectiveStore } from '../stores/CollectiveStore'
import { useQuestionStore } from '../stores/QuestionStore'

const collectiveStore = useCollectiveStore()
const questionStore = useQuestionStore()

onMounted(() => {
  console.log('CollectiveView mounted')
})

</script>
