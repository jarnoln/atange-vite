import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi, vitest } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '../../src/routes'
import { useCollectiveStore } from '../../src/stores/CollectiveStore'
import { useQuestionStore } from '../../src/stores/QuestionStore'
import { useSessionStore } from '../../src/stores/SessionStore'
import ReorderQuestionsView from '../../src/views/ReorderQuestionsView.vue'


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

const collective = {
  name: 'jla',
  title: 'JLA',
  description: 'Justice League of America',
  creator: 'superman',
  permissions: {
    canEdit: true,
    canJoin: true
  }
}

describe('Test ReorderQuestionsView', () => {
  beforeEach(() => {
    collectiveStore.clear()
    questionStore.clear()
    sessionStore.clear()
    collectiveStore.addCollective(collective.name, collective.title, collective.description, collective.creator)
    collectiveStore.selectCollective(collective.name)
    collectiveStore.updateCollectivePermissions('jla', { canEdit: true, canJoin: true })
    questionStore.addQuestion('q1', 'Question 1', '')
    questionStore.addQuestion('q2', 'Question 2', '')
    questionStore.addQuestion('q3', 'Question 3', '')
  }),
  it('can reorder questions', async () => {
    sessionStore.login('superman', 'abcd')
    const wrapper = mount(ReorderQuestionsView, {
      props: {
        collectiveName: collective.name
      },
      global: {
        plugins: [pinia, router]
      }
    })
    expect(collectiveStore.currentCollective).toEqual(collective)
    expect(wrapper.text()).toContain('Question 1')
    expect(wrapper.text()).toContain('Question 2')
    expect(wrapper.text()).toContain('Question 3')
    const q1_up = wrapper.get('#move-up-q1')
    const q2_up = wrapper.get('#move-up-q2')
    const q3_up = wrapper.get('#move-up-q3')
    const q1_down = wrapper.get('#move-down-q1')
    const q2_down = wrapper.get('#move-down-q2')
    const q3_down = wrapper.get('#move-down-q3')
    expect(questionStore.questions[0].name).toBe('q1')
    expect(questionStore.questions[1].name).toBe('q2')
    expect(questionStore.questions[2].name).toBe('q3') 
    q3_up.trigger('click')
    expect(questionStore.questions[0].name).toBe('q1')
    expect(questionStore.questions[1].name).toBe('q3')
    expect(questionStore.questions[2].name).toBe('q2') 
    q1_down.trigger('click')
    expect(questionStore.questions[0].name).toBe('q3')
    expect(questionStore.questions[1].name).toBe('q1')
    expect(questionStore.questions[2].name).toBe('q2') 
  }),
  it('does not show reorder buttons if not logged in', async () => {
    const wrapper = mount(ReorderQuestionsView, {
      props: {
        collectiveName: collective.name
      },
      global: {
        plugins: [pinia, router]
      }
    })
    const q1_up = wrapper.find('#move-up-q1')
    const q1_down = wrapper.find('#move-down-q1')
    expect(q1_up.exists()).toBe(false)
    expect(q1_down.exists()).toBe(false)
  })
})
