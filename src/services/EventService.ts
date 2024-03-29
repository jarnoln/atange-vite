import axios from 'axios'

import { useCollectiveStore } from '../stores/CollectiveStore'
import { useQuestionStore } from '../stores/QuestionStore'
import { useSessionStore } from '../stores/SessionStore'
import { useSettingsStore } from '../stores/SettingsStore'
import { useNotificationStore } from '../stores/NotificationStore'
import { useUserGroupStore } from '../stores/UserGroupStore'
import { Collective, Question, Answer } from '../types'


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
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

function storeSettings(settingsData: any) {
  const settingsStore = useSettingsStore()
  console.log('Fetched settings: ')
  console.log(settingsData)
  const title = settingsData['title']
  const allowRegister = settingsData['allow_register']
  const oneCollective = settingsData['one_collective']
  const usersCanCreateCollectives = settingsData['users_can_create_collectives']
  const requireNames = settingsData['require_names']
  settingsStore.set(title, allowRegister, oneCollective, usersCanCreateCollectives, requireNames)
}

function storeCollectives(collectiveData: any[]) {
  const collectiveStore = useCollectiveStore()
  collectiveStore.clear()
  console.log('Fetched collectives: ', collectiveData.length)
  console.log(...collectiveData)
  collectiveData.forEach(item => collectiveStore.addCollective(item.name, item.title, item.description, item.is_visible, item.creator))
}

function storeUserGroups(userGroupData: any[]) {
  const userGroupStore = useUserGroupStore()
  userGroupStore.clear()
  console.log('Fetched user groups: ', userGroupData.length)
  console.log(...userGroupData)
  userGroupData.forEach(item => userGroupStore.addUserGroup(item.name, item.title, item.type, item.collective))
}

function storeCandidates(candidateData: any[]) {
  const userGroupStore = useUserGroupStore()
  userGroupStore.clearCandidates()
  console.log('Fetched user candidates: ', candidateData.length)
  console.log(...candidateData)
  candidateData.forEach(item => userGroupStore.addCandidate(item.username, item.first_name, item.last_name))
}

function storeQuestions(questionData: any[]) {
  const questionStore = useQuestionStore()
  questionStore.clear()
  console.log('Fetched questions: ', questionData.length)
  questionData.forEach(question => {
    console.log(question)
    questionStore.addQuestion(question.name, question.title, question.description, question.item_type, question.order)
    if (question.answers && Array.isArray(question.answers)) {
      question.answers.forEach((answer: Answer) => {
        questionStore.addAnswer(question.name, answer.user, answer.vote, answer.comment)
      })
    }
  })
}

function handleApiError(error: any, message: string) {
  console.log('handleApiError', error, message)
  const notificationStore = useNotificationStore()
  if (error.message) {
    if (error.message === 'Network Error') {
      notificationStore.notifyError(message + 'Could not connect to backend server.')
    } else {
      notificationStore.notifyError(message + error.message)
    }
  } else if (error.response) {
    console.log(error.response.data)
    if (error.response.status === 401) {
      notificationStore.notifyError(message + 'Unauthorized (401)')
    } else {
      notificationStore.notifyError(message + 'Server returned status code: ' + error.response.status)
    }
  } else {
    notificationStore.notifyError(message)
  }
  if (error && error.response) {
    return error.response.status
  }
  return 0
}

export const EventService = {
// For some reason unit tests were not able to call fetchCollectives
// so moved functionality out here so that can test until can
// figure out way to test method
  fetchGlobalSettings: async () => {
    const notificationStore = useNotificationStore()
    notificationStore.notifyWaitOn('fetching_settings', 'Fetching settings')
    const path: string = '/api/settings/'
    return apiClient.get(path)
      .then(response => {
        notificationStore.notifyWaitOff('fetching_settings')
        notificationStore.isLoadingCollectives = false
        if (response.status === 200) {
          storeSettings(response.data)
        } else {
          notificationStore.notifyError('Login: Expected status code 200, server returned ' + response.status)
          console.log(response.data)
        }
      })
      .catch(error => {
        notificationStore.notifyWaitOff('fetching_settings')
        const message = 'Failed to fetch settings. '
        handleApiError(error, message)
      })
  },
  fetchCollectives: async () => {
    const notificationStore = useNotificationStore()
    notificationStore.notifyWaitOn('fetching_collectives', 'Fetching communities')
    notificationStore.isLoadingCollectives = true
    const path: string = '/api/collectives/'
    return apiClient.get(path)
      .then(response => {
        notificationStore.notifyWaitOff('fetching_collectives')
        notificationStore.isLoadingCollectives = false
        if (response.status === 200) {
          storeCollectives(response.data)
        } else {
          notificationStore.notifyError('Login: Expected status code 200, server returned ' + response.status)
          console.log(response.data)
        }
      })
      .catch(error => {
        notificationStore.notifyWaitOff('fetching_collectives')
        notificationStore.isLoadingCollectives = false
        const message = 'Failed to fetch collectives. '
        handleApiError(error, message)
      })
  },
  fetchUserGroups: async () => {
    // Fetch list of all user groups (with name, title, type and collective, but not members)
    const notificationStore = useNotificationStore()
    notificationStore.notifyWaitOn('fetching_user_groups', 'Fetching user groups')
    const path: string = '/api/user_groups/'
    return apiClient.get(path)
      .then(response => {
        notificationStore.notifyWaitOff('fetching_user_groups')
        if (response.status === 200) {
          storeUserGroups(response.data)
        } else {
          notificationStore.notifyError('Login: Expected status code 200, server returned ' + response.status)
          console.log(response.data)
        }
      })
      .catch(error => {
        notificationStore.notifyWaitOff('fetching_user_groups')
        const message = 'Failed to fetch user groups. '
        handleApiError(error, message)
      })
  },
  fetchUserGroupMembers: async (userGroupName: string) => {
    // Fetch members of given user group as list of usernames
    const path = '/api/group/' + userGroupName + '/members/'
    console.log('GET', path)
    return apiClient.get(path)
      .then(response => {
        if (response.status === 200) {
          const userGroupStore = useUserGroupStore()
          userGroupStore.setUserGroupMembers(userGroupName, response.data)
        } else {
          const notificationStore = useNotificationStore()
          notificationStore.notifyError('Login: Expected status code 200, server returned ' + response.status)
          console.log(response.data)
        }
      })
      .catch(error => {
        const message = 'Failed to fetch user group members:' + userGroupName
        handleApiError(error, message)
      })
  },
  fetchAllUserGroupMembers: async () => {
    // Fetch members of all user groups. Return promise that resolves when all fetches have finished.
    const ugPromises = [] as any[]
    const userGroupStore = useUserGroupStore()
    const notificationStore = useNotificationStore()
    notificationStore.notifyWaitOn('fetching_user_group_members', 'Fetching user group members')
    userGroupStore.userGroups.forEach(ug => {
      ugPromises.push(EventService.fetchUserGroupMembers(ug.name))
    });
    return Promise.all(ugPromises).then(() => notificationStore.notifyWaitOff('fetching_user_group_members'))
  },
  fetchCandidates: async () => {
    const notificationStore = useNotificationStore()
    const userGroupStore = useUserGroupStore()
    const electionName = userGroupStore.getElectionName()
    if (electionName === '') {
      console.warn('fetchCandidates: No election. Exiting.')
      return undefined
    }
    notificationStore.notifyWaitOn('fetching_candidates', 'Fetching candidates')
    const path: string = '/api/group/' + electionName + '/member_details/'
    console.log('GET', path)
    return apiClient.get(path)
      .then(response => {
        notificationStore.notifyWaitOff('fetching_candidates')
        if (response.status === 200) {
          storeCandidates(response.data)
        } else {
          notificationStore.notifyError('fetchCandidates: Expected status code 200, server returned ' + response.status)
          console.log(response.data)
        }
      })
      .catch(error => {
        notificationStore.notifyWaitOff('fetching_candidates')
        const message = 'Failed to fetch candidates. '
        handleApiError(error, message)
      })
  },
  fetchQuestions: async (collectiveName: string) => {
    const notificationStore = useNotificationStore()
    notificationStore.notifyWaitOn('fetching_questions', 'Fetching questions')
    notificationStore.isLoadingQuestions = true
    const path: string = '/api/collective/' + collectiveName + '/questions/'
    return apiClient.get(path)
      .then(response => {
        notificationStore.notifyWaitOff('fetching_questions')
        notificationStore.isLoadingQuestions = false
        if (response.status === 200) {
          storeQuestions(response.data)
        } else {
          notificationStore.notifyError('fetchQuestions: Expected status code 200, server returned ' + response.status)
          console.log(response.data)
        }
      })
      .catch(error => {
        notificationStore.notifyWaitOff('fetching_questions')
        notificationStore.isLoadingQuestions = false
        const message = 'Failed to fetch questions. '
        handleApiError(error, message)
      })
  },
  fetchAllQuestions: async () => {
    // Fetch questions from of all collectives. Return promise that resolves when all fetches have finished.
    const questionPromises = [] as any[]
    const collectiveStore = useCollectiveStore()
    collectiveStore.visibleCollectives.forEach(collective => {
      questionPromises.push(EventService.fetchQuestions(collective.name))
    });
    return Promise.all(questionPromises)
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
  fetchUserInfo: async () => {
    const notificationStore = useNotificationStore()
    const sessionStore = useSessionStore()
    if (sessionStore.username === '') {
      console.log('EventStore:fetchUserInfo: no user seleted. Aborting.')
      return null
    }
    notificationStore.notifyWaitOn('fetching_user_info', 'Fetching user info')
    const config = {
      headers: {
        'Authorization': 'Token ' + sessionStore.token
      }
    }
    const path: string = '/api/user/' + sessionStore.username + '/'
    console.log('GET', path)
    return apiClient.get(path, config)
      .then(response => {
        notificationStore.notifyWaitOff('fetching_user_info')
        if (response.status === 200) {
          console.log('fetched user_info:', response.data)
          sessionStore.firstName = response.data['first_name']
          sessionStore.lastName = response.data['last_name']
          sessionStore.email = response.data['email']
        } else {
          notificationStore.notifyError('fetchUserInfo: Expected status code 200, server returned ' + response.status)
          console.log(response.data)
        }
      })
      .catch(error => {
        notificationStore.notifyWaitOff('fetching_user_info')
        const message = 'Failed to fetch user info. '
        handleApiError(error, message)
      })
  },
  fetchUserDescription: async () => {
    const notificationStore = useNotificationStore()
    const sessionStore = useSessionStore()
    if (sessionStore.username === '') {
      console.log('EventStore:fetchUserDescription: no user seleted. Aborting.')
      return null
    }
    notificationStore.notifyWaitOn('fetching_user_description', 'Fetching user description')
    const config = {
      headers: {
        'Authorization': 'Token ' + sessionStore.token
      }
    }
    const path: string = '/api/user/' + sessionStore.username + '/description/'
    console.log('GET', path)
    return apiClient.get(path, config)
      .then(response => {
        notificationStore.notifyWaitOff('fetching_user_description')
        if (response.status === 200) {
          console.log('fetched user_info:', response.data)
          sessionStore.candidateNumber = response.data['candidate_number']
          sessionStore.homepage = response.data['home_page']
          sessionStore.description = response.data['description']
        } else {
          notificationStore.notifyError('fetchUserDescription: Expected status code 200, server returned ' + response.status)
          console.log(response.data)
        }
      })
      .catch(error => {
        notificationStore.notifyWaitOff('fetching_user_description')
        const message = 'Failed to fetch user description. '
        handleApiError(error, message)
      })
  },
  fetchCandidateDescription: async (username: string) => {
    const notificationStore = useNotificationStore()
    const sessionStore = useSessionStore()
    const userGroupStore = useUserGroupStore()
    if (username === '') {
      console.log('EventStore:fetchCandidateDescription: no user seleted. Aborting.')
      return null
    }
    notificationStore.notifyWaitOn('fetching_user_description', 'Fetching user description')
    const path: string = '/api/user/' + username + '/description/'
    console.log('GET', path)
    return apiClient.get(path)
      .then(response => {
        notificationStore.notifyWaitOff('fetching_user_description')
        if (response.status === 200) {
          console.log('fetched user_info:', response.data)
          const description = response.data['description']
          const homepage = response.data['home_page']
          const number = response.data['candidate_number']
          userGroupStore.updateCandidateDescription(username, description, homepage, number)
        } else {
          notificationStore.notifyError('fetchUserDescription: Expected status code 200, server returned ' + response.status)
          console.log(response.data)
        }
      })
      .catch(error => {
        notificationStore.notifyWaitOff('fetching_user_description')
        const message = 'Failed to fetch user description. '
        handleApiError(error, message)
      })
  },
  fetchMemberships: async () => {
    const notificationStore = useNotificationStore()
    const sessionStore = useSessionStore()
    if (sessionStore.username === '') {
      console.log('EventStore:fetchMemberships: no user seleted. Aborting.')
      return null
    }
    notificationStore.notifyWaitOn('fetching_memberships', 'Fetching memberships')
    const config = {
      headers: {
        'Authorization': 'Token ' + sessionStore.token
      }
    }
    const path: string = '/api/user/' + sessionStore.username + '/memberships/'
    console.log('GET', path)
    return apiClient.get(path, config)
      .then(response => {
        notificationStore.notifyWaitOff('fetching_memberships')
        if (response.status === 200) {
          console.log('fetched memberships:', response.data)
          sessionStore.memberships = response.data
        } else {
          notificationStore.notifyError('fetchMemberships: Expected status code 200, server returned ' + response.status)
          console.log(response.data)
        }
      })
      .catch(error => {
        notificationStore.notifyWaitOff('fetching_memberships')
        const message = 'Failed to fetch memberships. '
        handleApiError(error, message)
      })
  },
  updateUserInfo: async () => {
    const notificationStore = useNotificationStore()
    const sessionStore = useSessionStore()
    notificationStore.notifyWaitOn('updating_user_info', 'Saving user info')
    const config = {
      headers: {
        'Authorization': 'Token ' + sessionStore.token
      }
    }
    const dataOut = {
      first_name: sessionStore.firstName,
      last_name: sessionStore.lastName,
      email: sessionStore.email
    }
    const path: string = '/api/user/' + sessionStore.username + '/'
    console.log('PUT', path)
    console.log(dataOut)
    return apiClient.put(path, dataOut, config)
      .then(response => {
        notificationStore.notifyWaitOff('updating_user_info')
        if (response.status === 200) {
          console.log('updated user_info:', response.data)
        } else {
          notificationStore.notifyError('updateUserInfo: Expected status code 200, server returned ' + response.status)
          console.log(response.data)
        }
      })
      .catch(error => {
        notificationStore.notifyWaitOff('updating_user_info')
        const message = 'Failed to update user info. '
        handleApiError(error, message)
      })
  },
  updateUserDescription: async () => {
    const notificationStore = useNotificationStore()
    const sessionStore = useSessionStore()
    notificationStore.notifyWaitOn('updating_user_description', 'Saving user description')
    const config = {
      headers: {
        'Authorization': 'Token ' + sessionStore.token
      }
    }
    let candidateNumber = null
    let homepage = null
    if (sessionStore.homepage) {
      homepage = sessionStore.homepage
    }
    if (sessionStore.candidateNumber > 0) {
      candidateNumber = sessionStore.candidateNumber
    }
    const dataOut = {
      candidate_number: candidateNumber,
      description: sessionStore.description,
      home_page: homepage,
    }
    const path: string = '/api/user/' + sessionStore.username + '/description/'
    console.log('PUT', path)
    console.log(dataOut)
    return apiClient.put(path, dataOut, config)
      .then(response => {
        notificationStore.notifyWaitOff('updating_user_description')
        if (response.status === 200) {
          console.log('updated user_info:', response.data)
        } else {
          notificationStore.notifyError('updateUserDescription: Expected status code 200, server returned ' + response.status)
          console.log(response.data)
        }
      })
      .catch(error => {
        notificationStore.notifyWaitOff('updating_user_description')
        const message = 'Failed to update user description. '
        handleApiError(error, message)
      })
  },
  joinGroup: async (groupName: string) => {
    console.log('joinGroup', groupName)
    const notificationStore = useNotificationStore()
    const sessionStore = useSessionStore()
    notificationStore.notifyWaitOn('updating_memberships', 'Updating memberships')
    const config = {
      headers: {
        'Authorization': 'Token ' + sessionStore.token
      }
    }
    const path: string = '/api/group/' + groupName + '/join/'
    console.log('POST', path)
    return apiClient.post(path, {}, config)
      .then(response => {
        notificationStore.notifyWaitOff('updating_memberships')
        if (response.status === 204) {
          console.log('added user to group', groupName, ':', response.data)
        } else {
          notificationStore.notifyError('updateUserInfo: Expected status code 200, server returned ' + response.status)
          console.log(response.data)
        }
      })
      .catch(error => {
        notificationStore.notifyWaitOff('updating_memberships')
        const message = 'Failed to update membership. '
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
    const path = '/auth/token/login/'
    console.log('POST', path, dataOut)
    return apiClient.post(path, dataOut)
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
      if (error.response && error.response.status === 400) {
        notificationStore.notifyError('Invalid credentials.')
      } else {
        handleApiError(error, 'Failed to log in. ')
      }
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
    const path = '/auth/users/me/'
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
  createCollective: async (name: string, title: string, description: string, isVisible: boolean) => {
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
      is_visible: isVisible,
    }
    const config = {
      headers: {
        'Authorization': 'Token ' + sessionStore.token
      }
    }
    notificationStore.notifyWaitOn('creating_collective', 'Creating ' + title)
    console.log('POST', path, dataOut)
    return apiClient.post(path, dataOut, config)
    .then(response => {
      notificationStore.notifyWaitOff('creating_collective')
      if (response.status === 201) {
        notificationStore.notifySuccess('collective_created', 'Created new community: ' + title)
      } else {
        notificationStore.notifyError('Expected status code 201, server returned code:' + response.status)
        console.log(response.data)
      }
    })
    .catch(error => {
      notificationStore.notifyWaitOff('creating_collective')
      const message = 'Failed to create community: ' + name + '. '
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
      is_visible: collective.isVisible,
    }
    const config = {
      headers: {
        'Authorization': 'Token ' + sessionStore.token
      }
    }
    notificationStore.notifyWaitOn('updating_collective', 'Updating ' + collective.name)
    console.log('PUT', path, dataOut)
    return apiClient.put(path, dataOut, config)
    .then(response => {
      notificationStore.notifyWaitOff('updating_collective')
      if (response.status === 200) {
        notificationStore.notifySuccess('collective_updated', 'Updated ' + collective.title)
        console.log(response.data)
      } else {
        notificationStore.notifyError('Expected status code 200, server returned code:' + response.status)
        console.log(response.data)
      }
    })
    .catch(error => {
      notificationStore.notifyWaitOff('updating_collective')
      const message = 'Failed to update ' + collective.name + '. '
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
    notificationStore.notifyWaitOn('deleting_collective', 'Deleting ' + collective.title)
    return apiClient.delete(path, config)
    .then(response => {
      notificationStore.notifyWaitOff('deleting_collective')
      if (response.status === 204) {
        notificationStore.notifySuccess('collective_deleted', 'Deleted ' + collective.title)
      } else {
        notificationStore.notifyError('Expected status code 204, server returned code:' + response.status)
        console.log(response.data)
      }
    })
    .catch(error => {
      notificationStore.notifyWaitOff('deleting_collective')
      const message = 'Failed to delete ' + collective.name + '. '
      handleApiError(error, message)
    })
  },
  fetchAdmins: async (collectiveName: string) => {
    const notificationStore = useNotificationStore()
    const sessionStore = useSessionStore()
    notificationStore.notifyWaitOn('fetching_admins', 'Fetching admins')
    const path: string = '/api/collective/' + collectiveName + '/admins/'
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
        notificationStore.notifyWaitOff('fetching_admins')
        if (response.status === 200) {
          console.log('fetched admins:', response.data)
          const collectiveStore = useCollectiveStore()
          collectiveStore.admins = response.data
        } else {
          notificationStore.notifyError('fetchAdmins: Expected status code 200, server returned ' + response.status)
          console.log(response.data)
        }
      })
      .catch(error => {
        notificationStore.notifyWaitOff('admins')
        const message = 'Failed to fetch permissions. '
        handleApiError(error, message)
      })
  },
  addAdmin: async (username: string) => {
    // Adds admin to collective in the backend.
    const notificationStore = useNotificationStore()
    const sessionStore = useSessionStore()
    if (!sessionStore.isLoggedIn) {
      notificationStore.notifyError('Not logged in')
      return null
    }
    const collectiveStore = useCollectiveStore()
    if (!collectiveStore.currentCollective) {
      notificationStore.notifyError('No community selected, can not add admin')
      return null
    }
    const path: string = '/api/collective/' + collectiveStore.currentCollective.name + '/admin/' + username + '/'
    const dataOut = {}
    const config = {
      headers: {
        'Authorization': 'Token ' + sessionStore.token
      }
    }
    notificationStore.notifyWaitOn('adding_admin', 'Adding ' + username + ' to administrators')
    console.log('POST', path, dataOut)
    return apiClient.post(path, dataOut, config)
    .then(response => {
      notificationStore.notifyWaitOff('adding_admin')
      if (response.status === 204) {
        notificationStore.notifySuccess('added_admin', 'Added ' + username + ' to administrators')
        console.log(response.data)
        return true
      } else {
        notificationStore.notifyError('Expected status code 204, server returned code:' + response.status)
        console.log(response.data)
        return false
      }
    })
    .catch(error => {
      notificationStore.notifyWaitOff('adding_admin')
      const message = 'Failed to add ' + username + ' to administrators.'
      handleApiError(error, message)
      return false
    })
  },
  kickAdmin: async (username: string) => {
    // Adds admin to collective in the backend.
    console.log('EventService kickAdmin username =', username)
    const notificationStore = useNotificationStore()
    const sessionStore = useSessionStore()
    if (!sessionStore.isLoggedIn) {
      notificationStore.notifyError('Not logged in')
      return null
    }
    const collectiveStore = useCollectiveStore()
    if (!collectiveStore.currentCollective) {
      notificationStore.notifyError('No community selected, can not add admin')
      return null
    }
    const path: string = '/api/collective/' + collectiveStore.currentCollective.name + '/admin/' + username + '/'
    const dataOut = {}
    const config = {
      headers: {
        'Authorization': 'Token ' + sessionStore.token
      }
    }
    notificationStore.notifyWaitOn('kicking_admin', 'Removing ' + username + ' from administrators')
    console.log('DELETE', path, dataOut)
    return apiClient.delete(path, config)
    .then(response => {
      notificationStore.notifyWaitOff('kicking_admin')
      if (response.status === 204) {
        notificationStore.notifySuccess('kicked_admin', 'Removed ' + username + ' from administrators')
        return true
      } else {
        notificationStore.notifyError('Expected status code 204, server returned code:' + response.status)
        return false
      }
    })
    .catch(error => {
      notificationStore.notifyWaitOff('kicking_admin')
      const message = 'Failed to kick ' + username + ' from administrators.'
      handleApiError(error, message)
      return false
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
      notificationStore.notifyError('No community selected, can not create question')
      return null
    }
    const path: string = '/api/collective/' + collectiveStore.currentCollective.name + '/question/' + question.name + '/'
    const dataOut = {
      name: question.name,
      title: question.title,
      description: question.description,
      item_type: question.itemType.toUpperCase(),
      order: question.order,
      parent: question.parent
    }
    const config = {
      headers: {
        'Authorization': 'Token ' + sessionStore.token
      }
    }
    if (question.itemType === 'H') {
      notificationStore.notifyWaitOn('creating_question', 'Creating header ' + question.title)
    } else {
      notificationStore.notifyWaitOn('creating_question', 'Creating question ' + question.title)
    }
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
      notificationStore.notifyError('No community selected, can not update question')
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
      notificationStore.notifyError('No community selected, can not delete question')
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
      notificationStore.notifyError('No community selected, can not update answer')
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
