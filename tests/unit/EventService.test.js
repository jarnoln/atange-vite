import { beforeEach, describe, expect, it, vi, vitest } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { EventService } from '../../src/services/EventService.ts'
import { useCollectiveStore } from '../../src/stores/CollectiveStore'
import { useNotificationStore } from '../../src/stores/NotificationStore'
import { useQuestionStore } from '../../src/stores/QuestionStore'
import { useSessionStore } from '../../src/stores/SessionStore'

vi.mock('axios')

createTestingPinia({
  createSpy: vitest.fn,
  stubActions: false
})

const collectiveStore = useCollectiveStore()
const notificationStore = useNotificationStore()
const questionStore = useQuestionStore()
const sessionStore = useSessionStore()


beforeEach(() => {
  collectiveStore.clear()
  notificationStore.clear()
  questionStore.clear()
  sessionStore.clear()
})

describe('Test EventService:fetchCollectives', () => {
  it('fetches and stores collectives', async () => {
    expect(collectiveStore.currentCollective).toBe(undefined)
    expect(collectiveStore.collectives.length).toBe(0)
    await EventService.fetchCollectives()
    expect(collectiveStore.collectives.length).toBe(1)
    expect(collectiveStore.collectives[0].name).toBe('jla')
    expect(collectiveStore.collectives[0].title).toBe('JLA')
    // expect(testFetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/collectives/')
  }),
  it('clears previous collectives when fetching new ones', async () => {
    collectiveStore.addCollective('jsa', 'JSA', '')
    collectiveStore.addCollective('checkmate', 'Checkmate', '')
    collectiveStore.selectCollective('jsa')
    expect(collectiveStore.currentCollective.name).toBe('jsa')
    expect(collectiveStore.count).toBe(2)
    await EventService.fetchCollectives()
    expect(collectiveStore.count).toBe(1)
    expect(collectiveStore.collectives[0].name).toBe('jla')
    expect(collectiveStore.collectives[0].title).toBe('JLA')
    expect(collectiveStore.currentCollective).toBe(undefined)
    // expect(testFetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/collectives/')
  })
})

describe('Test EventService:fetchQuestions', () => {
  it('fetches and stores questions', async () => {
    expect(questionStore.count).toBe(0)
    await EventService.fetchQuestions('jla')
    expect(questionStore.count).toBe(1)
    expect(questionStore.questions[0].name).toBe('q1')
    expect(questionStore.questions[0].title).toBe('Question 1')
  }),
  it('clears previous questions when fetching new ones', async () => {
    questionStore.addQuestion('oq1', 'Old question 1', '')
    questionStore.addQuestion('oq2', 'Old question 2', '')
    expect(questionStore.count).toBe(2)
    await EventService.fetchQuestions('jla')
    expect(questionStore.count).toBe(1)
    expect(questionStore.questions[0].name).toBe('q1')
    expect(questionStore.questions[0].title).toBe('Question 1')
  })
})

describe('Test EventService:login', () => {
  it('sets username and token', async () => {
    expect(sessionStore.username).toBe('')
    expect(sessionStore.token).toBe('')
    expect(notificationStore.count).toBe(0)
    await EventService.login('superman', 'manofsteel')
    expect(sessionStore.username).toBe('superman')
    expect(sessionStore.token).toBe('abcd')
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('logged_in')
  })
})

describe('Test EventService:register', () => {
  it('can register', async () => {
    expect(notificationStore.count).toBe(0)
    await EventService.register('superman', 'manofsteel')
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('registered')
  })
})

describe('Test EventService:logout', () => {
  it('resets username and token', async () => {
    await EventService.login('superman', 'manofsteel')
    expect(sessionStore.username).toBe('superman')
    expect(sessionStore.token).toBe('abcd')
    await EventService.logout()
    expect(sessionStore.username).toBe('')
    expect(sessionStore.token).toBe('')
    expect(notificationStore.latestNotification.id).toBe('logged_out')
  })
})

describe('Test EventService:createCollective', () => {
  it('creates collective', async () => {
    expect(collectiveStore.collectives.length).toBe(0)
    expect(notificationStore.count).toBe(0)
    await EventService.createCollective({name: 'jla', title:'JLA', description: ''})
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('collective_created')
    // expect(collectiveStore.collectives.length).toBe(1) // EventService does not add collective to store
  })
})

describe('Test EventService:updateCollective', () => {
  it('updates collective', async () => {
    collectiveStore.addCollective('jla', 'JLA', '')
    expect(notificationStore.count).toBe(0)
    await EventService.updateCollective({name: 'jla', title:'JC', description: 'Justice Club'})
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('collective_updated')
    // expect(collectiveStore.collectives.length).toBe(1) // EventService does not add collective to store
  })
})

describe('Test EventService:deleteCollective', () => {
  it('deletes collective', async () => {
    expect(notificationStore.count).toBe(0)
    await EventService.deleteCollective({name: 'jla', title:'JLA'})
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('collective_deleted')
  })
})

describe('Test EventService:createQuestion', () => {
  it('creates question', async () => {
    collectiveStore.addCollective('jla', 'JLA', '')
    collectiveStore.selectCollective('jla')
    expect(questionStore.count).toBe(0)
    expect(notificationStore.count).toBe(0)
    await EventService.createQuestion({name: 'q1', title:'Question 1', description: ''})
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('question_created')
  }),
  it('does not create question if no collective selected', async () => {
    expect(questionStore.count).toBe(0)
    expect(notificationStore.count).toBe(0)
    await EventService.createQuestion({name: 'q1', title:'Question 1', description: ''})
    expect(notificationStore.count).toBe(0)
  })
})

describe('Test EventService:updateQuestion', () => {
  it('updates question', async () => {
    collectiveStore.addCollective('jla', 'JLA', '')
    collectiveStore.selectCollective('jla')
    expect(notificationStore.count).toBe(0)
    await EventService.updateQuestion('q1', {name: 'q2', title:'Question 2', description: 'Question of Ethics'})
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('question_updated')
    // expect(collectiveStore.collectives.length).toBe(1) // EventService does not add collective to store
  })
})

describe('Test EventService:deleteQuestion', () => {
  it('deletes question', async () => {
    collectiveStore.addCollective('jla', 'JLA', '')
    collectiveStore.selectCollective('jla')
    expect(notificationStore.count).toBe(0)
    await EventService.deleteQuestion({name: 'q1'})
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('question_deleted')
  })
})

describe('Test EventService:updateAnswer', () => {
  it('updates answer', async () => {
    collectiveStore.addCollective('jla', 'JLA', '')
    collectiveStore.selectCollective('jla')
    expect(notificationStore.count).toBe(0)
    await EventService.updateAnswer('q1', 'u1', 1, '')
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('answer_updated')
  })
})
