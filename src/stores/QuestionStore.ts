import { defineStore } from 'pinia'
import { Question, Approval } from '../types'
import { approval } from '../utils/approval'

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
    getQuestion(name: string) {
      const question = this.questions.find(question => question.name === name)
      if (question != undefined) {
        return { ...question }  // Return copy of question. This should not be used to alter questions.
      } else {
        return undefined
      }
    },
    getQuestionSkeleton() : Question {
      return {
        name: '',
        title: '',
        description: '',
        itemType: 'Q',
        order: 0,
        parent: '',
        creator: '',
        answers: []
      }
    },
    getAnswers(questionName: string) {
      const question = this.questions.find(question => question.name === questionName)
      if (question != undefined) {
        return question.answers
      } else {
        return []
      }
    },
    getYeas(questionName: string) {
      const answers = this.getAnswers(questionName)
      return answers.filter(answer => answer.vote === 1)
    },
    getNays(questionName: string) {
      const answers = this.getAnswers(questionName)
      return answers.filter(answer => answer.vote === -1)
    },
    getAbstains(questionName: string) {
      const answers = this.getAnswers(questionName)
      return answers.filter(answer => answer.vote === 0)
    },
    getApproval(questionName: string) : Approval {
      const answers = this.getAnswers(questionName)
      return approval(answers)
    },
    addQuestion(name: string, title: string, description: string) {
      if (name.length < 1) {
        console.warn('addQuestion: Name too short:', name)
        return false
      }
      if (title.length < 1) {
        console.warn('addQuestion: Title too short:', title)
        return false
      }
      if (this.getQuestion(name) != undefined) {
        console.warn('Question with name', name, 'already exists')
        return false
      }
      this.questions.push({
        name: name,
        title: title,
        description: description,
        itemType: 'Q',
        order: 0,
        parent: '',
        creator: '',
        answers: []
      })
      return true
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
    },
    addAnswer(questionName: string, user: string, vote: number, comment: string) {
      const question = this.questions.find(question => question.name === questionName)
      if (question != undefined) {
        const answer = question.answers.find(answer => answer.user === user)
        if (answer === undefined) {
          question.answers.push({
            question: questionName,
            user: user,
            vote: vote,
            comment: comment
          })
        } else {
          console.warn('User', user, 'has already answered question', questionName)
        }
      } else {
        console.warn('No such question:', questionName)
      }
    },
    updateAnswer(questionName: string, user: string, vote: number, comment: string) {
      const question = this.questions.find(question => question.name === questionName)
      if (question != undefined) {
        const answer = question.answers.find(answer => answer.user === user)
        if (answer != undefined) {
          answer.vote = vote
          answer.comment = comment
        } else {
          console.warn('User', user, 'has not answered question', questionName)
        }
      } else {
        console.warn('No such question:', questionName)
      }
    },
    setAnswer(questionName: string, user: string, vote: number, comment: string) {
      // Sets answer regardless if it exists or not
      // If answer exists, update it. Otherwise create new answer.
      const question = this.questions.find(question => question.name === questionName)
      if (question != undefined) {
        const answer = question.answers.find(answer => answer.user === user)
        if (answer != undefined) {
          answer.vote = vote
          answer.comment = comment
        } else {
          question.answers.push({
            question: questionName,
            user: user,
            vote: vote,
            comment: comment
          })
        }
      } else {
        console.warn('No such question:', questionName)
      }
    },
    deleteAnswer(questionName: string, user: string) {
      const question = this.questions.find(question => question.name === questionName)
      if (question != undefined) {
        const answer = question.answers.find(answer => answer.user === user)
        if (answer != undefined) {
          question.answers = question.answers.filter(answer => answer.user != user)
        } else {
          console.warn('User', user, 'has not answered question', questionName)
        }
      } else {
        console.warn('No such question:', questionName)
      }
    }
  }
})
