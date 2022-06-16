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
    expect(collectiveStore.collectives[0].description).toBe('')
    expect(collectiveStore.collectives[0].permissions.canEdit).toBe(false)
    expect(collectiveStore.collectives[0].permissions.canJoin).toBe(false)
    // expect(testFetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/collectives/')
  }),
  it('clears previous collectives when fetching new ones', async () => {
    collectiveStore.addCollective('jsa', 'JSA', '', 'flash')
    collectiveStore.addCollective('checkmate', 'Checkmate', '', 'stein')
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

describe('Test EventService::fetchPermissions', () => {
  it('fetch permissions', async () => {
    await EventService.fetchCollectives()
    expect(collectiveStore.collectives.length).toBe(1)
    expect(collectiveStore.collectives[0].permissions.canEdit).toBe(false)
    expect(collectiveStore.collectives[0].permissions.canJoin).toBe(false)
    sessionStore.login('superman', 'abcd')
    await EventService.fetchPermissions('jla')
    expect(collectiveStore.collectives[0].permissions.canEdit).toBe(true)
    expect(collectiveStore.collectives[0].permissions.canJoin).toBe(true)
  })
})

describe('Test EventService:fetchQuestions', () => {
  it('fetches and stores questions', async () => {
    expect(questionStore.count).toBe(0)
    await EventService.fetchQuestions('jla')
    expect(questionStore.count).toBe(2)
    expect(questionStore.questions[0].name).toBe('q1')
    expect(questionStore.questions[0].title).toBe('Question 1')
    expect(questionStore.questions[0].itemType).toBe('Q')
    expect(questionStore.questions[0].order).toBe(13)
    expect(questionStore.questions[1].name).toBe('h1')
    expect(questionStore.questions[1].title).toBe('Header 1')
    expect(questionStore.questions[1].itemType).toBe('H')
    expect(questionStore.questions[1].order).toBe(1337)

  }),
  it('clears previous questions when fetching new ones', async () => {
    questionStore.addQuestion('oq1', 'Old question 1', '')
    questionStore.addQuestion('oq2', 'Old question 2', '')
    questionStore.addQuestion('oq3', 'Old question 3', '')
    expect(questionStore.count).toBe(3)
    await EventService.fetchQuestions('jla')
    expect(questionStore.count).toBe(2)
    expect(questionStore.questions[0].name).toBe('q1')
    expect(questionStore.questions[0].title).toBe('Question 1')
  })
})

describe('Test EventService:fetchUserInfo', () => {
  it('fetches and stores user info', async () => {
    sessionStore.login('superman', 'abcd')
    expect(sessionStore.token).toBe('abcd')
    expect(sessionStore.firstName).toBe('')
    expect(sessionStore.lastName).toBe('')
    expect(sessionStore.email).toBe('')
    expect(notificationStore.count).toBe(0)
    await EventService.fetchUserInfo()
    expect(notificationStore.count).toBe(0)
    // expect(sessionStore.firstName).toBe('Clark')
    // expect(sessionStore.lastName).toBe('Kent')
    // expect(sessionStore.email).toBe('')
  })
}),
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
  }),
  it('fails if password is wrong', async () => {
    expect(sessionStore.username).toBe('')
    expect(sessionStore.token).toBe('')
    expect(notificationStore.count).toBe(0)
    await EventService.login('superman', 'iambatman')
    expect(sessionStore.username).toBe('')
    expect(sessionStore.token).toBe('')
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('error')
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

describe('Test EventService:deleteCurrentUser', () => {
  it('deletes current user', async () => {
    await EventService.login('superman', 'manofsteel')
    expect(sessionStore.username).toBe('superman')
    expect(sessionStore.token).toBe('abcd')
    await EventService.deleteCurrentUser('manofsteel')
    expect(sessionStore.username).toBe('')
    expect(sessionStore.token).toBe('')
    expect(notificationStore.latestNotification.id).toBe('user_deleted')
  })
})

describe('Test EventService:createCollective', () => {
  it('creates collective', async () => {
    expect(collectiveStore.collectives.length).toBe(0)
    expect(notificationStore.count).toBe(0)
    sessionStore.login('superman', 'abcd')
    await EventService.createCollective('jla', 'JLA', '')
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('collective_created')
  }),
  it ('does not create collective if not logged in', async () => {
    expect(notificationStore.count).toBe(0)
    await EventService.createCollective('jla', 'JLA', '')
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.message).toBe('Not logged in')
  })
})

describe('Test EventService:updateCollective', () => {
  it('updates collective', async () => {
    collectiveStore.addCollective('jla', 'JLA', '', 'superman')
    sessionStore.login('superman', 'abcd')
    expect(notificationStore.count).toBe(0)
    await EventService.updateCollective({name: 'jla', title:'JC', description: 'Justice Club'})
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('collective_updated')
  }),
  it('does not update collective if not logged in', async () => {
    collectiveStore.addCollective('jla', 'JLA', '', 'superman')
    expect(notificationStore.count).toBe(0)
    await EventService.updateCollective({name: 'jla', title:'JC', description: 'Justice Club'})
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('error')
    expect(notificationStore.latestNotification.message).toBe('Not logged in')
  })
})

describe('Test EventService:deleteCollective', () => {
  it('deletes collective', async () => {
    expect(notificationStore.count).toBe(0)
    sessionStore.login('superman', 'abcd')
    await EventService.deleteCollective({name: 'jla', title:'JLA'})
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('collective_deleted')
  }),
  it('does not delete collective if not logged in', async () => {
    expect(notificationStore.count).toBe(0)
    await EventService.deleteCollective({name: 'jla', title:'JLA'})
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('error')
    expect(notificationStore.latestNotification.message).toBe('Not logged in')
  })
})

describe('Test EventService:createQuestion', () => {
  it('creates question', async () => {
    collectiveStore.addCollective('jla', 'JLA', '', 'superman')
    collectiveStore.selectCollective('jla')
    sessionStore.login('superman', 'abcd')
    expect(questionStore.count).toBe(0)
    expect(notificationStore.count).toBe(0)
    await EventService.createQuestion({
      name: 'q1',
      title:'Question 1',
      description: '',
      itemType: 'Q',
      order: 1,
      parent: ''
    })
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('question_created')
  }),
  it('does not create question if not logged in', async () => {
    collectiveStore.addCollective('jla', 'JLA', '', 'superman')
    collectiveStore.selectCollective('jla')
    expect(notificationStore.count).toBe(0)
    expect(await EventService.createQuestion({name: 'q1', title:'Question 1', description: ''})).toBe(null)
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('error')
    expect(notificationStore.latestNotification.message).toBe('Not logged in')
  })
  it('does not create question if no collective selected', async () => {
    sessionStore.login('superman', 'abcd')
    expect(questionStore.count).toBe(0)
    expect(notificationStore.count).toBe(0)
    expect(await EventService.createQuestion({name: 'q1', title:'Question 1', description: ''})).toBe(null)
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('error')
    expect(notificationStore.latestNotification.message).toBe('No community selected, can not create question')
  })
})

describe('Test EventService:updateQuestion', () => {
  it('updates question', async () => {
    collectiveStore.addCollective('jla', 'JLA', '', 'superman')
    collectiveStore.selectCollective('jla')
    sessionStore.login('superman', 'abcd')
    expect(notificationStore.count).toBe(0)
    await EventService.updateQuestion('q1', {name: 'q2', title:'Question 2', description: 'Question of Ethics'})
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('question_updated')
  }),
  it('does not update question if not logged in', async () => {
    collectiveStore.addCollective('jla', 'JLA', '', 'superman')
    collectiveStore.selectCollective('jla')
    expect(notificationStore.count).toBe(0)
    expect(await EventService.updateQuestion({name: 'q1', title:'Question 1', description: ''})).toBe(null)
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('error')
    expect(notificationStore.latestNotification.message).toBe('Not logged in')
  })
  it('does not update question if no collective selected', async () => {
    sessionStore.login('superman', 'abcd')
    expect(questionStore.count).toBe(0)
    expect(notificationStore.count).toBe(0)
    expect(await EventService.updateQuestion({name: 'q1', title:'Question 1', description: ''})).toBe(null)
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('error')
    expect(notificationStore.latestNotification.message).toBe('No community selected, can not update question')
  })
})

describe('Test EventService:deleteQuestion', () => {
  it('deletes question', async () => {
    collectiveStore.addCollective('jla', 'JLA', '', 'superman')
    collectiveStore.selectCollective('jla')
    sessionStore.login('superman', 'abcd')
    expect(notificationStore.count).toBe(0)
    await EventService.deleteQuestion('q1')
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('question_deleted')
  }),
  it('does not delete question if not logged in', async () => {
    collectiveStore.addCollective('jla', 'JLA', '', 'superman')
    collectiveStore.selectCollective('jla')
    expect(notificationStore.count).toBe(0)
    expect(await EventService.deleteQuestion({name: 'q1', title:'Question 1', description: ''})).toBe(null)
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('error')
    expect(notificationStore.latestNotification.message).toBe('Not logged in')
  })
  it('does not delete question if no collective selected', async () => {
    sessionStore.login('superman', 'abcd')
    expect(questionStore.count).toBe(0)
    expect(notificationStore.count).toBe(0)
    expect(await EventService.deleteQuestion({name: 'q1', title:'Question 1', description: ''})).toBe(null)
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('error')
    expect(notificationStore.latestNotification.message).toBe('No community selected, can not delete question')
  })
})

describe('Test EventService:updateAnswer', () => {
  it('updates answer', async () => {
    collectiveStore.addCollective('jla', 'JLA', '', 'superman')
    collectiveStore.selectCollective('jla')
    sessionStore.login('superman', 'abcd')
    expect(notificationStore.count).toBe(0)
    await EventService.updateAnswer('q1', 'u1', 1, '')
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('answer_updated')
  }),
  it('does not update answer if not logged in', async () => {
    collectiveStore.addCollective('jla', 'JLA', '', 'superman')
    collectiveStore.selectCollective('jla')
    expect(notificationStore.count).toBe(0)
    expect(await EventService.updateAnswer('q1', 'u1', 1, '')).toBe(null)
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('error')
    expect(notificationStore.latestNotification.message).toBe('Not logged in')
  })
  it('does not update answer if no collective selected', async () => {
    sessionStore.login('superman', 'abcd')
    expect(questionStore.count).toBe(0)
    expect(notificationStore.count).toBe(0)
    expect(await EventService.updateAnswer('q1', 'u1', 1, '')).toBe(null)
    expect(notificationStore.count).toBe(1)
    expect(notificationStore.latestNotification.id).toBe('error')
    expect(notificationStore.latestNotification.message).toBe('No community selected, can not update answer')
  })
})
