import { defineStore } from 'pinia'
import { Question, Answer, Approval } from '../types'
import { approval } from '../utils/approval'

export const useQuestionStore = defineStore('QuestionStore', {
  state: () => ({
    questions: [] as Question[]
  }),
  getters: {
    count: (state) : number => {
      return state.questions.length
    },
    questionNames: (state) => {
      return state.questions.map(question => question.name)
    },
    questionItems: state => {
      return state.questions.filter(question => question.itemType === 'Q')
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
    getAnswers(questionName: string) : Answer[] {
      const question = this.questions.find(question => question.name === questionName)
      if (question != undefined) {
        return question.answers
      } else {
        return []
      }
    },
    getYeas(questionName: string) : Answer[] {
      const answers = this.getAnswers(questionName)
      return answers.filter(answer => answer.vote === 1)
    },
    getNays(questionName: string) : Answer[] {
      const answers = this.getAnswers(questionName)
      return answers.filter(answer => answer.vote === -1)
    },
    getAbstains(questionName: string) : Answer[] {
      const answers = this.getAnswers(questionName)
      return answers.filter(answer => answer.vote === 0)
    },
    getApproval(questionName: string) : Approval {
      const answers = this.getAnswers(questionName)
      return approval(answers)
    },
    getUserAnswer(questionName: string, username: string) {
      const question = this.getQuestion(questionName)
      if (question != undefined) {
        const answer = question.answers.find(answer => answer.user === username)
        return answer
      }
      return undefined
    },
    getUserAnswerLetter(questionName: string, username: string) {
      const answer = this.getUserAnswer(questionName, username)
      if (answer != undefined) {
        if (answer.vote === 1) {
          return 'Y'
        } else if (answer.vote === -1) {
          return 'N'
        }
      }
      return '-'
    },
    addQuestion(
        name: string,
        title: string,
        description: string,
        itemType: string = 'Q',
        order: number = -1,
        parent: string = '') : Boolean {
      console.log('addQuestion name:', name, 'itemType:', itemType, 'order:', order)
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
      if (itemType === 'question') {
        itemType = 'Q'
      } else if (itemType === 'header') {
        itemType = 'H'
      }
      if (order === -1) {
        order = this.questions.length
      }
      this.questions.push({
        name: name,
        title: title,
        description: description,
        itemType: itemType,
        order: order,
        parent: parent,
        creator: '',
        answers: []
      })
      return true
    },
    updateQuestion(name: string, title: string, description: string) : Boolean {
      const index = this.questions.findIndex(question => question.name === name)
      if (index >= 0) {
        this.questions[index].title = title
        this.questions[index].description = description
        return true
      } else {
        console.warn('Question', name, 'not found')
        return false
      }
    },
    deleteQuestion(name: string) : Boolean {
      console.log('QuestionStore:deleteQuestion', name)
      const originalLength = this.questions.length
      this.questions = this.questions.filter(question => question.name != name)
      return this.questions.length < originalLength
    },
    switchQuestionOrder(index_1: any, index_2: any) {
      if (index_1 === index_2) {
        return false
      }
      this.questions.forEach((question, index) => question.order = index)
      const firstOrder = this.questions[index_1].order
      const secondOrder = this.questions[index_2].order
      this.questions[index_1].order = secondOrder
      this.questions[index_2].order = firstOrder
      this.questions.sort((q1, q2) => (q1.order - q2.order))
    },
    moveQuestionUp(name: string) : Boolean {
      const index = this.questions.findIndex(question => question.name === name)
      if (index < 0) {
        console.log('Question not found:', name)
        return false
      }
      if (index == 0) {
        console.log('Question already at top')
        return false
      }
      this.switchQuestionOrder(index, index-1)
      return true
    },
    moveQuestionDown(name: string) : Boolean {
      const index = this.questions.findIndex(question => question.name === name)
      if (index < 0) {
        console.log('Question not found:', name)
        return false
      }
      if (index >= this.questions.length - 1) {
        console.log('Question already at bottom')
        return false
      }
      this.switchQuestionOrder(index, index+1)
      return true
    },
    addAnswer(questionName: string, user: string, vote: number, comment: string) : Boolean {
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
          return true
        } else {
          console.warn('User', user, 'has already answered question', questionName)
          return false
        }
      } else {
        console.warn('No such question:', questionName)
        return false
      }
    },
    updateAnswer(questionName: string, user: string, vote: number, comment: string) : Boolean {
      const question = this.questions.find(question => question.name === questionName)
      if (question != undefined) {
        const answer = question.answers.find(answer => answer.user === user)
        if (answer != undefined) {
          answer.vote = vote
          answer.comment = comment
          return true
        } else {
          console.warn('User', user, 'has not answered question', questionName)
          return false
        }
      } else {
        console.warn('No such question:', questionName)
        return false
      }
    },
    setAnswer(questionName: string, user: string, vote: number, comment: string) : Boolean {
      // Sets answer regardless if it exists or not
      // If answer exists, update it. Otherwise create new answer.
      const question = this.questions.find(question => question.name === questionName)
      if (question != undefined) {
        const answer = question.answers.find(answer => answer.user === user)
        if (answer != undefined) {
          answer.vote = vote
          answer.comment = comment
          return true
        } else {
          question.answers.push({
            question: questionName,
            user: user,
            vote: vote,
            comment: comment
          })
          return true
        }
      } else {
        console.warn('No such question:', questionName)
        return false
      }
    },
    deleteAnswer(questionName: string, user: string) : Boolean {
      const question = this.questions.find(question => question.name === questionName)
      if (question != undefined) {
        const answer = question.answers.find(answer => answer.user === user)
        if (answer != undefined) {
          const originalCount = question.answers.length
          question.answers = question.answers.filter(answer => answer.user != user)
          if (question.answers.length < originalCount) {
            console.log('Answer deleted')
            return true
          } else {
            return false
          }
        } else {
          console.warn('User', user, 'has not answered question', questionName)
          return false
        }
      } else {
        console.warn('No such question:', questionName)
        return false
      }
    }
  }
})
