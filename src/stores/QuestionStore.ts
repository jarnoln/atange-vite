import { defineStore } from 'pinia'
import { Question } from '../types'

export const useQuestionStore = defineStore('QuestionStore', {
  state: () => ({
    questions: [] as Question[]
  }),
  getters: {
    count: (state) => {
      return state.questions.length
    },
    questionNames: (state) => {
      return state.questions.map(question => question.name)
    }
  },
  actions: {
    clear() {
      this.questions = []
    },
    addQuestion(name: string, title: string, description: string) {
      if (name.length < 1) {
        console.warn('addQuestion: Name too short:', name)
        return
      }
      if (title.length < 1) {
        console.warn('addQuestion: Title too short:', title)
        return
      }
      this.questions.push({
        name: name,
        title: title,
        description: description,
        itemType: 'Q',
        order: 0,
        parent: '',
        creator: ''
      })
    },
    updateQuestion(name: string, title: string, description: string) {
      const index = this.questions.findIndex(question => question.name === name)
      if (index >= 0) {
        this.questions[index].title = title
        this.questions[index].description = description
      } else {
        console.warn('Question', name, 'not found')
      }
    },
    deleteQuestion(name: string) {
      console.log('QuestionStore:deleteQuestion', name)
      const index = this.questions.findIndex(question => question.name === name)
      console.log(name, 'found at index', index)
      this.questions = this.questions.filter(question => question.name != name)
    }
  }
})
