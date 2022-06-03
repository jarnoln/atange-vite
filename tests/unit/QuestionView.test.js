import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi, vitest } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '../../src/routes'
import { useCollectiveStore } from '../../src/stores/CollectiveStore'
import { useQuestionStore } from '../../src/stores/QuestionStore'
import { useSessionStore } from '../../src/stores/SessionStore'
import QuestionView from '../../src/views/QuestionView.vue'


const pinia = createTestingPinia({
  createSpy: vitest.fn,
  stubActions: false
})

const router = createRouter({
  history: createWebHistory(), // Use browser built-in history
  routes: routes
})

vi.mock('axios')

const collectiveStore = useCollectiveStore()
const questionStore = useQuestionStore()
const sessionStore = useSessionStore()


describe('Test QuestionView', () => {
  beforeEach(() => {
    sessionStore.clear()
    questionStore.clear()
    collectiveStore.clear()
    collectiveStore.addCollective('jla', 'JLA', '')
    collectiveStore.selectCollective('jla')
  }),
  it('shows question information', async () => {
    questionStore.addQuestion('q1', 'Question 1', 'Most vital question')
    // sessionStore.login('superman', 'abcd')
    const wrapper = mount(QuestionView, {
      props: {
        questionName: 'q1'
      },
      global: {
        plugins: [pinia, router]
      }
    })
    await nextTick()
    const title = wrapper.get('#question-title')
    const description = wrapper.get('#question-description')
    expect(title.text()).toBe('Question 1')
    expect(description.text()).toBe('Most vital question')
  }),
  it('shows unknown if question does not exist', () => {
    const wrapper = mount(QuestionView, {
      props: {
        questionName: 'qq'
      },
      global: {
        plugins: [pinia, router]
      }
    })
    expect(wrapper.text()).toContain('Unknown question')
  }),
  it('shows buttons which can be used to cast vote', async () => {
    questionStore.addQuestion('q1', 'Question 1', 'Most vital question')
    sessionStore.login('superman', 'abcd')
    const wrapper = mount(QuestionView, {
      props: {
        questionName: 'q1'
      },
      global: {
        plugins: [pinia, router]
      }
    })
    await nextTick()
    const title = wrapper.get('#question-title')
    const description = wrapper.get('#question-description')
    const approval = wrapper.get('#approval-title')
    const yesButton = wrapper.get('#answer-yes-btn')
    const abstainButton = wrapper.get('#answer-abstain-btn')
    const noButton = wrapper.get('#answer-no-btn')
    expect(title.text()).toBe('Question 1')
    expect(description.text()).toBe('Most vital question')
    expect(approval.text()).toBe('Approval: - %')
    expect(questionStore.getAnswers('q1').length).toBe(0)
    yesButton.trigger('click')
    await nextTick()
    expect(questionStore.getAnswers('q1').length).toBe(1)
    expect(questionStore.getAnswers('q1')[0].user).toBe('superman')
    expect(questionStore.getAnswers('q1')[0].vote).toBe(1)
    expect(approval.text()).toBe('Approval: 100.0 %')
    noButton.trigger('click')
    await nextTick()
    expect(questionStore.getAnswers('q1').length).toBe(1)
    expect(questionStore.getAnswers('q1')[0].user).toBe('superman')
    expect(questionStore.getAnswers('q1')[0].vote).toBe(-1)
    expect(approval.text()).toBe('Approval: 0.0 %')
    abstainButton.trigger('click')
    await nextTick()
    expect(questionStore.getAnswers('q1').length).toBe(1)
    expect(questionStore.getAnswers('q1')[0].user).toBe('superman')
    expect(questionStore.getAnswers('q1')[0].vote).toBe(0)
    expect(approval.text()).toBe('Approval: - %')
  })
})
