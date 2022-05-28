import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it, vi, vitest } from 'vitest'
import { useQuestionStore } from '../../../src/stores/QuestionStore'

vi.mock('axios')

const pinia = createPinia()
setActivePinia(pinia)

const questionStore = useQuestionStore()

const q1 = {
  name: 'q1',
  title: 'Question 1',
  description: 'Most important question'
}

const q2 = {
  name: 'q2',
  title: 'Question 2',
  description: 'Less important question'
}

describe('Test QuestionStore', () => {
  beforeEach(() => {
    questionStore.clear()
  }),
  it('can store questions', () => {
    expect(questionStore.count).toBe(0)
    questionStore.addQuestion(q1.name, q1.title, q1.description)
    expect(questionStore.count).toBe(1)
    questionStore.addQuestion(q2.name, q2.title, q2.description)
    expect(questionStore.count).toBe(2)
  }),
  it('does not store invalid questions', () => {
    expect(questionStore.count).toBe(0)
    questionStore.addQuestion('', q1.title, q1.description)
    expect(questionStore.count).toBe(0)
    questionStore.addQuestion(q1.name, '', q1.description)
    expect(questionStore.count).toBe(0)
  }),
  it('can update question', () => {
    questionStore.addQuestion(q1.name, q1.title, q1.description)
    questionStore.updateQuestion(q1.name, 'Outsiders', 'Out in the cold')
    expect(questionStore.questions[0].title, 'Outsiders')
    expect(questionStore.questions[0].description, 'Out in the cold')
  }),
  it('can delete questions', () => {
    questionStore.addQuestion(q1.name, q1.title, q1.description)
    questionStore.addQuestion(q2.name, q2.title, q2.description)
    expect(questionStore.count).toBe(2)
    questionStore.deleteQuestion(q1.name)
    expect(questionStore.count).toBe(1)
    questionStore.deleteQuestion(q2.name)
    expect(questionStore.count).toBe(0)
  }),
  it('try to delete unknown question', () => {
    questionStore.addQuestion(q1.name, q1.title, q1.description)
    expect(questionStore.count).toBe(1)
    questionStore.deleteQuestion('unknown')
    expect(questionStore.count).toBe(1)
    questionStore.deleteQuestion(q1.name)
    expect(questionStore.count).toBe(0)
  }),
  it('can get question names', () => {
    expect(questionStore.questionNames).toEqual([])
    questionStore.addQuestion(q1.name, q1.title, q1.description)
    questionStore.addQuestion(q2.name, q2.title, q2.description)
    expect(questionStore.questionNames).toEqual([q1.name, q2.name])
  }),
  it('can be cleared', () => {
    questionStore.addQuestion(q1.name, q1.title, q1.description)
    questionStore.addQuestion(q2.name, q2.title, q2.description)
    expect(questionStore.questions.length).toBe(2)
    expect(questionStore.count).toBe(2)
    questionStore.clear()
    expect(questionStore.questions.length).toBe(0)
    expect(questionStore.count).toBe(0)
  })
  it('can store answers', () => {
    questionStore.addQuestion(q1.name, q1.title, q1.description)
    expect(questionStore.getAnswers(q1.name).length).toBe(0)
    questionStore.addAnswer(q1.name, 'superman', 1, 'Of course')
    expect(questionStore.getAnswers(q1.name).length).toBe(1)
    questionStore.addAnswer(q1.name, 'batman', -1, 'No way')
    expect(questionStore.getAnswers(q1.name).length).toBe(2)
    expect(questionStore.getAnswers(q1.name)[0].user).toBe('superman')
    expect(questionStore.getAnswers(q1.name)[1].user).toBe('batman')
    expect(questionStore.getAnswers(q1.name)[0].vote).toBe(1)
    expect(questionStore.getAnswers(q1.name)[1].vote).toBe(-1)
  })
})
