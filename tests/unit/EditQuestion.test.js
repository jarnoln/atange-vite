import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi, vitest } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '../../src/routes'
import { useCollectiveStore } from '../../src/stores/CollectiveStore'
import { useQuestionStore } from '../../src/stores/QuestionStore'
import { useSessionStore } from '../../src/stores/SessionStore'
import EditQuestion from '../../src/components/EditQuestion.vue'


vi.mock('axios')

const router = createRouter({
  history: createWebHistory(), // Use browser built-in history
  routes: routes
})

const pinia = createTestingPinia({
  createSpy: vitest.fn,
})

const collectiveStore = useCollectiveStore()
const questionStore = useQuestionStore()
const sessionStore = useSessionStore()


describe('Test EditQuestion', () => {
  beforeEach(() => {
    sessionStore.clear()
    collectiveStore.clear()
    questionStore.clear()
    collectiveStore.addCollective('jsa', 'JSA', '', 'superman')
    collectiveStore.selectCollective('jsa')
  }),
  it('can add question', async () => {
    sessionStore.login('superman', 'abcd')
    collectiveStore.updateCollectivePermissions('jsa', { canEdit: true, canJoin: true })
    const wrapper = mount(EditQuestion, {
      global: {
        plugins: [router, pinia]
      },
      props: {
        questionName: ''
      }
    })
    expect(wrapper.text()).toContain('Title')
    expect(wrapper.text()).toContain('Name')
    expect(wrapper.text()).toContain('Description')
    const nameInput = wrapper.get('#question-name')
    const titleInput = wrapper.get('#question-title')
    const descriptionInput = wrapper.get('#question-description')
    const submitButton = wrapper.get('#question-submit-button')
    expect(nameInput.isVisible()).toBe(true)
    expect(titleInput.isVisible()).toBe(true)
    expect(submitButton.isVisible()).toBe(true)
    expect(submitButton.attributes().disabled).toBe('true')
    expect(questionStore.count).toBe(0)
    nameInput.setValue('q1')
    titleInput.setValue('Question 1')
    descriptionInput.setValue('Important question')
    submitButton.trigger('click')
    // await nextTick()
    // expect(questionStore.count).toBe(1)
  }),
  it('can edit existing question', async () => {
    sessionStore.login('superman', 'abcd')
    collectiveStore.updateCollectivePermissions('jsa', { canEdit: true, canJoin: true })
    questionStore.addQuestion('q1', 'Question 1', 'A very important question')
    const wrapper = mount(EditQuestion, {
      global: {
        plugins: [router, pinia]
      },
      props: {
        questionName: 'q1'
      }
    })
    expect(wrapper.text()).not.toContain('Name')
    expect(wrapper.text()).toContain('Title')
    expect(wrapper.text()).toContain('Description')
    const titleInput = wrapper.get('#question-title')
    const descriptionInput = wrapper.get('#question-description')
    const submitButton = wrapper.get('#question-submit-button')
    expect(titleInput.isVisible()).toBe(true)
    expect(submitButton.isVisible()).toBe(true)
    expect(submitButton.attributes().disabled).toBe('true')
    titleInput.setValue('Question 2')
    descriptionInput.setValue('Less important question')
    submitButton.trigger('click')
  })
})
