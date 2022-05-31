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
  it('show question information', async () => {
    collectiveStore.addCollective('jla', 'JLA', '')
    collectiveStore.selectCollective('jla')
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
    // await nextTick()
    const title = wrapper.get('#question-title')
    const description = wrapper.get('#question-description')
    expect(title.text()).toBe('Question 1')
    expect(description.text()).toBe('Most vital question')
  }),
  it('show unknown if question does not exist', () => {
    questionStore.clear()
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
  it('show answer buttons if logged in', async () => {
    collectiveStore.addCollective('jla', 'JLA', '')
    collectiveStore.selectCollective('jla')
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
    const yesButton = wrapper.get('#answer-yes-btn')
    const abstainButton = wrapper.get('#answer-abstain-btn')
    const noButton = wrapper.get('#answer-no-btn')
    expect(title.text()).toBe('Question 1')
    expect(description.text()).toBe('Most vital question')
  })
})
