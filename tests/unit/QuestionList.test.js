import { nextTick } from 'vue'
import { render, fireEvent } from '@testing-library/vue'
import { beforeEach, describe, expect, it, test, vi, vitest } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import en from '../../src/locales/en.json'
import { routes } from '../../src/routes'
import { useCollectiveStore } from '../../src/stores/CollectiveStore'
import { useQuestionStore } from '../../src/stores/QuestionStore'
import { useSessionStore } from '../../src/stores/SessionStore'
import QuestionList from '../../src/components/QuestionList.vue'

vi.mock('axios')

const router = createRouter({
  history: createWebHistory(), // Use browser built-in history
  routes: routes
})

const pinia = createTestingPinia({
  createSpy: vitest.fn,
  stubActions: false
})

const messages = {
  'en': en
}

const i18n = createI18n({
  locale: 'en',
  messages
})

const collectiveStore = useCollectiveStore()
const questionStore = useQuestionStore()
const sessionStore = useSessionStore()

describe('Test QuestionList', () => {
  it('shows question titles', async () => {
    // The render method returns a collection of utilities to query your component.
    collectiveStore.addCollective('jla', 'JLA', '', true, 'superman')
    collectiveStore.selectCollective('jla')
    questionStore.addQuestion('q1', 'Question 1', 'A very important question')
    questionStore.addQuestion('q2', 'Question 2', 'A less important question')
    const { getByText } = render(QuestionList, {
      props: {
        collectiveName: 'jla'
      },
      global: {
        plugins: [i18n, pinia, router]
      }
    })
    await nextTick()
    // getByText returns the first matching node for the provided text, and
    // throws an error if no elements match or if more than one match is found.
    getByText('Questions: 2')
    getByText('Question 1')
    getByText('Question 2')
  })
})
