import axios from 'axios'

import { useCollectiveStore } from '../stores/CollectiveStore'
import { useQuestionStore } from '../stores/QuestionStore'
import { useSessionStore } from '../stores/SessionStore'
import { useNotificationStore } from '../stores/NotificationStore'
import { Collective, Question } from '../types'


// Define the real backed server URL in environment variable VITE_BACKEND_URL
// For example can create .env.local-file with content
//  VITE_BACKEND_URL="https://my.backend.server"
// By default using Django's default development server URL
let server = import.meta.env.VITE_BACKEND_URL
if (!server) {
  server = 'http://127.0.0.1:8000'
}

console.log('backend server:', server)

const apiClient = axios.create({
  baseURL: server,
  timeout: 2000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

function storeCollectives(collectiveData: Collective[]) {
  const collectiveStore = useCollectiveStore()
  collectiveStore.clear()
  console.log('Fetched collectives: ', collectiveData.length)
  console.log(...collectiveData)
  collectiveData.forEach(item => collectiveStore.addCollective(item.name, item.title, item.description, item.creator))
}

function storeQuestions(questionData: Question[]) {
  const questionStore = useQuestionStore()
  questionStore.clear()
  console.log('Fetched questions: ', questionData.length)
  questionData.forEach(question => {
    console.log(question)
    questionStore.addQuestion(question.name, question.title, question.description)
    question.answers.forEach(answer => {
      questionStore.addAnswer(question.name, answer.user, answer.vote, answer.comment)
    })
  })
}

function handleApiError(error: any, message: string) {
  const notificationStore = useNotificationStore()
  if (error.message) {
    if (error.message === 'Network Error') {
      notificationStore.notifyError(message + 'Could not connect to backend server.')
    } else {
      if (error.response) {
        if (error.response.status === 401) {
          notificationStore.notifyError(message + 'Unauthorized (401)')
        }
      } else {
        notificationStore.notifyError(message + error.message)
      }
    }
  } else if (error.response) {
    console.log(error.response.data)
    notificationStore.notifyError(message + 'Server returned status code: ' + error.response.status)
    return error.response.status
  } else {
    notificationStore.notifyError(message)
  }
  return 0
}

export const EventService = {
// For some reason unit tests were not able to call fetchCollectives
// so moved functionality out here so that can test until can
// figure out way to test method
  fetchCollectives: async () => {
    const notificationStore = useNotificationStore()
    notificationStore.notifyWaitOn('fetching_collectives', 'Fetching collectives')
    const path: string = '/api/collectives/'
    return apiClient.get(path)
      .then(response => {
        notificationStore.notifyWaitOff('fetching_collectives')
        if (response.status === 200) {
          storeCollectives(response.data)
        } else {
          notificationStore.notifyError('Login: Expected status code 200, server returned ' + response.status)
          console.log(response.data)
        }
      })
      .catch(error => {
        notificationStore.notifyWaitOff('fetching_collectives')
        const message = 'Failed to fetch collectives. '
        handleApiError(error, message)
      })
  },
  fetchQuestions: async (collectiveName: string) => {
    const notificationStore = useNotificationStore()
    notificationStore.notifyWaitOn('fetching_questions', 'Fetching questions')
    const path: string = '/api/collective/' + collectiveName + '/questions/'
    return apiClient.get(path)
      .then(response => {
        notificationStore.notifyWaitOff('fetching_questions')
        if (response.status === 200) {
          storeQuestions(response.data)
        } else {
          notificationStore.notifyError('fetchQuestions: Expected status code 200, server returned ' + response.status)
          console.log(response.data)
        }
      })
      .catch(error => {
        notificationStore.notifyWaitOff('fetching_questions')
        const message = 'Failed to fetch questions. '
        handleApiError(error, message)
      })
  },
  fetchPermissions: async (collectiveName: string) => {
    const notificationStore = useNotificationStore()
    const sessionStore = useSessionStore()
    notificationStore.notifyWaitOn('fetching_permissions', 'Fetching permissions')
    const path: string = '/api/collective/' + collectiveName + '/permissions/'
    let config = {}
    if (sessionStore.isLoggedIn) {
      config = {
        headers: {
          'Authorization': 'Token ' + sessionStore.token
        }
      }
    }
    console.log('GET', path)
    return apiClient.get(path, config)
      .then(response => {
        notificationStore.notifyWaitOff('fetching_permissions')
        if (response.status === 200) {
          console.log('fetched permissions:', response.data)
          const collectiveStore = useCollectiveStore()
          collectiveStore.updateCollectivePermissions(collectiveName, {
            canEdit: response.data['can_edit'],
            canJoin: response.data['can_join']
          })
        } else {
          notificationStore.notifyError('fetchPermissions: Expected status code 200, server returned ' + response.status)
          console.log(response.data)
        }
      })
      .catch(error => {
        notificationStore.notifyWaitOff('fetching_permissions')
        const message = 'Failed to fetch permissions. '
        handleApiError(error, message)
      })
  },
  login: async (username: string, password: string) => {
    const sessionStore = useSessionStore()
    const notificationStore = useNotificationStore()
    notificationStore.notifyLoggingInOn()

    const dataOut = {
      username: username,
      password: password
    }

    return apiClient.post('/auth/token/login/', dataOut)
    .then(response => {
      notificationStore.notifyLoggingInOff()
      if (response.status === 200) {
        const token = response.data['auth_token']
        sessionStore.login(username, token)
        notificationStore.notifySuccess('logged_in', 'Logged in')
      } else {
        notificationStore.notifyError('Login: Expected status code 200, server returned ' + response.status)
        console.log(response.data)
      }
    })
    .catch(error => {
      notificationStore.notifyLoggingInOff()
      sessionStore.clear()
      const message = 'Failed to log in. '
      handleApiError(error, message)
    })
  },
  register: async (username: string, password: string) => {
    const sessionStore = useSessionStore()
    const notificationStore = useNotificationStore()
    notificationStore.notifyRegisteringOn()

    const dataOut = {
      username: username,
      password: password
    }

    return apiClient.post('/auth/users/', dataOut)
    .then(response => {
      notificationStore.notifyRegisteringOff()
      if (response.data['username'] === username ) {
        notificationStore.notifySuccess('registered', 'Registered new user: ' + username)
      } else {
        const message = 'Registering: expected username, got ' + response.data['username']
        notificationStore.notifyError(message)
      }
    })
    .catch(error => {
      notificationStore.notifyLoggingInOff()
      const message = 'Failed to register new user: ' + username + '. '
      if (error.response) {
        console.log('error.response.data:', error.response.data)
        const data = error.response.data
        if ((data.username) && (data.username.length > 0)) {
          notificationStore.notifyError(message + data.username[0])
        } else if ((data.password) && (data.password.length > 0)) {
          notificationStore.notifyError(message + data.password[0])
        } else {
          notificationStore.notifyError(message + 'Server returned status code:' + error.response.status)
        }
      } else {
        notificationStore.notifyError(message)
      }
      console.log(error)
      sessionStore.clear()
    })
  },
  logout: async () => {
    const sessionStore = useSessionStore()
    const notificationStore = useNotificationStore()
    const config = {
      headers: {
        'Authorization': 'Token ' + sessionStore.token
      }
    }
    notificationStore.notifyWaitOn('logging_out', 'Logging out')
    return apiClient.post('/auth/token/logout/', {}, config)
    .then(response => {
      sessionStore.logout()
      notificationStore.notifyWaitOff('logging_out')
      if (response.status === 204) {
        notificationStore.notifySuccess('logged_out', 'Logged out')
      } else {
        notificationStore.notifyError('Logout: Expected status code 204, server returned ' + response.status)
        console.log(response.data)
      }
    })
    .catch(error => {
      sessionStore.logout()  // Even is server logout fails, still going to log out in frontend
      notificationStore.notifyWaitOff('logging_out')
      const message = 'Failed to log out. '
      handleApiError(error, message)
    })
  },
  deleteCurrentUser: async (password: string) => {
    const notificationStore = useNotificationStore()
    const sessionStore = useSessionStore()
    if (!sessionStore.isLoggedIn) {
      notificationStore.notifyError('Not logged in')
      return null
    }
    const dataOut = {
      current_password: password
    }
    const config = {
      headers: {
        'Authorization': 'Token ' + sessionStore.token
      },
      data: dataOut
    }
    const path = '/auth/user/me/'
    const username = sessionStore.username
    notificationStore.notifyWaitOn('deleting_user', 'Deleting user ' + username)
    console.log('DELETE', path)
    return apiClient.delete(path, config)
    .then(response => {
      notificationStore.notifyWaitOff('deleting_user')
      if (response.status === 204) {
        notificationStore.notifySuccess('user_deleted', 'Deleted user ' + username)
        sessionStore.logout()
      } else {
        notificationStore.notifyError('Expected status code 204, server returned code:' + response.status)
        console.log(response.data)
      }
    })
    .catch(error => {
      notificationStore.notifyWaitOff('deleting_user')
      const message = 'Failed to delete user ' + username
      handleApiError(error, message)
    })
  },
  createCollective: async (name: string, title: string, description: string) => {
    // Creates collective in the backend. Note: Does not add collective to store.
    const sessionStore = useSessionStore()
    const notificationStore = useNotificationStore()
    if (!sessionStore.isLoggedIn) {
      notificationStore.notifyError('Not logged in')
      return null
    }
    if (!name) {
      notificationStore.notifyError('Name not defined')
      return null
    }
    if (!title) {
      notificationStore.notifyError('Title not defined')
      return null
    }
    const path: string = '/api/collective/' + name + '/'
    const dataOut = {
      name: name,
      title: title,
      description: description,
      is_visible: true,
    }
    const config = {
      headers: {
        'Authorization': 'Token ' + sessionStore.token
      }
    }
    notificationStore.notifyWaitOn('creating_collective', 'Creating collective ' + title)
    console.log('POST', path, dataOut)
    return apiClient.post(path, dataOut, config)
    .then(response => {
      notificationStore.notifyWaitOff('creating_collective')
      if (response.status === 201) {
        notificationStore.notifySuccess('collective_created', 'Created new collective: ' + title)
      } else {
        notificationStore.notifyError('Expected status code 201, server returned code:' + response.status)
        console.log(response.data)
      }
    })
    .catch(error => {
      notificationStore.notifyWaitOff('creating_collective')
      const message = 'Failed to create collective: ' + name + '. '
      handleApiError(error, message)
    })
  },
  updateCollective: async (collective: Collective) => {
    // Updates collective in the backend
    const notificationStore = useNotificationStore()
    const sessionStore = useSessionStore()
    if (!sessionStore.isLoggedIn) {
      notificationStore.notifyError('Not logged in')
      return null
    }
    const path: string = '/api/collective/' + collective.name + '/'
    const dataOut = {
      name: collective.name,
      title: collective.title,
      description: collective.description,
      is_visible: true,
    }
    const config = {
      headers: {
        'Authorization': 'Token ' + sessionStore.token
      }
    }
    notificationStore.notifyWaitOn('updating_collective', 'Updating collective ' + collective.name)
    console.log('PUT', path, dataOut)
    return apiClient.put(path, dataOut, config)
    .then(response => {
      notificationStore.notifyWaitOff('updating_collective')
      if (response.status === 200) {
        notificationStore.notifySuccess('collective_updated', 'Updated collective: ' + collective.title)
        console.log(response.data)
      } else {
        notificationStore.notifyError('Expected status code 200, server returned code:' + response.status)
        console.log(response.data)
      }
    })
    .catch(error => {
      notificationStore.notifyWaitOff('updating_collective')
      const message = 'Failed to update collective: ' + collective.name + '. '
      handleApiError(error, message)
    })
  },
  deleteCollective: async (collective: Collective) => {
    console.log('EventService:deleteCollective()')
    const notificationStore = useNotificationStore()
    const sessionStore = useSessionStore()
    if (!sessionStore.isLoggedIn) {
      notificationStore.notifyError('Not logged in')
      return null
    }
    const path: string = '/api/collective/' + collective.name + '/'
    const config = {
      headers: {
        'Authorization': 'Token ' + sessionStore.token
      }
    }
    notificationStore.notifyWaitOn('deleting_collective', 'Deleting collective ' + collective.title)
    return apiClient.delete(path, config)
    .then(response => {
      notificationStore.notifyWaitOff('deleting_collective')
      if (response.status === 204) {
        notificationStore.notifySuccess('collective_deleted', 'Deleted collective: ' + collective.title)
      } else {
        notificationStore.notifyError('Expected status code 204, server returned code:' + response.status)
        console.log(response.data)
      }
    })
    .catch(error => {
      notificationStore.notifyWaitOff('deleting_collective')
      const message = 'Failed to delete collective: ' + collective.name + '. '
      handleApiError(error, message)
    })
  },
  createQuestion: async (question: Question) => {
    // Creates question in the backend. Note: Does not add question to store.
    const notificationStore = useNotificationStore()
    const sessionStore = useSessionStore()
    if (!sessionStore.isLoggedIn) {
      notificationStore.notifyError('Not logged in')
      return null
    }
    const collectiveStore = useCollectiveStore()
    if (!collectiveStore.currentCollective) {
      notificationStore.notifyError('No collective selected, can not create question')
      return null
    }
    const path: string = '/api/collective/' + collectiveStore.currentCollective.name + '/question/' + question.name + '/'
    const dataOut = {
      name: question.name,
      title: question.title,
      description: question.description,
      item_type: question.itemType,
      order: question.order,
      parent: question.parent,
      creator: ''
    }
    const config = {
      headers: {
        'Authorization': 'Token ' + sessionStore.token
      }
    }
    notificationStore.notifyWaitOn('creating_question', 'Creating question ' + question.title)
    console.log('POST', path, dataOut)
    return apiClient.post(path, dataOut, config)
    .then(response => {
      notificationStore.notifyWaitOff('creating_question')
      if (response.status === 201) {
        notificationStore.notifySuccess('question_created', 'Created new question: ' + question.title)
        console.log(response.data)
      } else {
        notificationStore.notifyError('Expected status code 201, server returned code:' + response.status)
        console.log(response.data)
      }
    })
    .catch(error => {
      notificationStore.notifyWaitOff('creating_question')
      const message = 'Failed to create question: ' + question.name + '. '
      handleApiError(error, message)
    })
  },
  updateQuestion: async (currentName: string, question: Question) => {
    // Update question in the backend.
    const notificationStore = useNotificationStore()
    const sessionStore = useSessionStore()
    if (!sessionStore.isLoggedIn) {
      notificationStore.notifyError('Not logged in')
      return null
    }
    const collectiveStore = useCollectiveStore()
    if (!collectiveStore.currentCollective) {
      notificationStore.notifyError('No collective selected, can not update question')
      return null
    }
    const path: string = '/api/collective/' + collectiveStore.currentCollective.name + '/question/' + currentName + '/'
    const dataOut = {
      name: question.name,
      title: question.title,
      description: question.description,
      item_type: question.itemType,
      order: question.order,
      parent: question.parent,
      creator: ''
    }
    const config = {
      headers: {
        'Authorization': 'Token ' + sessionStore.token
      }
    }
    notificationStore.notifyWaitOn('updating_question', 'Updating question ' + question.title)
    console.log('PUT', path, dataOut)
    return apiClient.put(path, dataOut, config)
    .then(response => {
      notificationStore.notifyWaitOff('updating_question')
      if (response.status === 200) {
        notificationStore.notifySuccess('question_updated', 'Updated question: ' + question.title)
        console.log(response.data)
      } else {
        notificationStore.notifyError('Expected status code 200, server returned code:' + response.status)
        console.log(response.data)
      }
    })
    .catch(error => {
      notificationStore.notifyWaitOff('updating_question')
      const message = 'Failed to update question: ' + currentName + '. '
      handleApiError(error, message)
    })
  },
  deleteQuestion: async (name: string) => {
    console.log('EventService:deleteQuestion', name)
    const notificationStore = useNotificationStore()
    if (name.length < 1) {
      notificationStore.notifyError('Invalid name')
      return null
    }
    const sessionStore = useSessionStore()
    if (!sessionStore.isLoggedIn) {
      notificationStore.notifyError('Not logged in')
      return null
    }
    const collectiveStore = useCollectiveStore()
    if (!collectiveStore.currentCollective) {
      notificationStore.notifyError('No collective selected, can not delete question')
      return null
    }
    const path: string = '/api/collective/' + collectiveStore.currentCollective.name + '/question/' + name + '/'
    const config = {
      headers: {
        'Authorization': 'Token ' + sessionStore.token
      }
    }
    notificationStore.notifyWaitOn('deleting_question', 'Deleting question ' + name)
    console.log('DELETE', path)
    return apiClient.delete(path, config)
    .then(response => {
      notificationStore.notifyWaitOff('deleting_question')
      if (response.status === 204) {
        notificationStore.notifySuccess('question_deleted', 'Deleted question: ' + name)
      } else {
        notificationStore.notifyError('Expected status code 204, server returned code:' + response.status)
        console.log(response.data)
      }
    })
    .catch(error => {
      notificationStore.notifyWaitOff('deleting_question')
      const message = 'Failed to delete question: ' + name + '. '
      handleApiError(error, message)
    })
  },
  updateAnswer: async (questionName: string, user: string, vote: number, comment: string) => {
    console.log('EventService:updateAnswer', questionName, user, vote, comment)
    const notificationStore = useNotificationStore()
    const sessionStore = useSessionStore()
    if (!sessionStore.isLoggedIn) {
      notificationStore.notifyError('Not logged in')
      return null
    }
    const collectiveStore = useCollectiveStore()
    if (!collectiveStore.currentCollective) {
      notificationStore.notifyError('No collective selected, can not update answer')
      return null
    }
    const collectiveName = collectiveStore.currentCollective.name
    const path = '/api/collective/' + collectiveName + '/question/' + questionName + '/answer/' + user + '/'
    const config = {
      headers: {
        'Authorization': 'Token ' + sessionStore.token
      }
    }
    const dataOut = {
      vote: vote,
      comment: comment
    }
    notificationStore.notifyWaitOn('updating_answer', 'Saving answer')
    console.log('PUT', path, dataOut)
    return apiClient.put(path, dataOut, config)
    .then(response => {
      notificationStore.notifyWaitOff('updating_answer')
      if (response.status === 200) {
        notificationStore.notifySuccess('answer_updated', 'Answer updated')
        console.log(response.data)
      } else if (response.status === 201) {
        notificationStore.notifySuccess('answer_saved', 'Answer saved')
         console.log(response.data)
      } else {
        notificationStore.notifyError('Expected status code 200, server returned code:' + response.status)
        console.log(response.data)
      }
    })
    .catch(error => {
      notificationStore.notifyWaitOff('updating_answer')
      const message = 'Failed to save answer'
      handleApiError(error, message)
    })
  }
}
