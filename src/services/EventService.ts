import axios from 'axios'

import { useCollectiveStore } from '../stores/CollectiveStore'
import { useSessionStore } from '../stores/SessionStore'
import { useNotificationStore } from '../stores/NotificationStore'
import { Collective } from '../types'


const server: string = 'http://127.0.0.1:8000'

const apiClient = axios.create({
  baseURL: server,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

function storeCollectives(collectiveData: Collective[]) {
  const collectiveStore = useCollectiveStore()
  console.log('Fetched collectives: ', collectiveData.length)
  collectiveData.forEach(item => collectiveStore.addCollective(item.name, item.title, ''))
}

function handleApiError(error: any, message: string) {
  const notificationStore = useNotificationStore()
  if (error.message) {
    if (error.message === 'Network Error') {
      notificationStore.notifyError(message + 'Could not connect to backend server.')
    } else {
      notificationStore.notifyError(message + error.message)
    }
  } else if (error.response) {
    console.log(error.response.data)
    notificationStore.notifyError(message + 'Server returned status code: ' + error.response.status)
  } else {
    notificationStore.notifyError(message)
  }
}

export const EventService = {
// For some reason unit tests were not able to call fetchCollectives
// so moved functionality out here so that can test until can
// figure out way to test method
  fetchCollectives: () => {
    const notificationStore = useNotificationStore()
    notificationStore.notifyWaitOn('fetching_collectives', 'Fetching collectives')
    const path: string = '/api/collectives/'
    apiClient.get(path)
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
  login: (username: string, password: string) => {
    const sessionStore = useSessionStore()
    const notificationStore = useNotificationStore()
    notificationStore.notifyLoggingInOn()

    const dataOut = {
      username: username,
      password: password
    }

    apiClient.post('/auth/token/login/', dataOut)
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
      const message = 'Failed to log in. '
      handleApiError(error, message)
      sessionStore.login('', '')
    })
  },
  register: (username: string, password: string) => {
    const sessionStore = useSessionStore()
    const notificationStore = useNotificationStore()
    notificationStore.notifyRegisteringOn()

    const dataOut = {
      username: username,
      password: password
    }

    apiClient.post('/auth/users/', dataOut)
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
      sessionStore.login('', '')
    })
  },
  logout: () => {
    const sessionStore = useSessionStore()
    const notificationStore = useNotificationStore()
    const config = {
      headers: {
        'Authorization': 'Token ' + sessionStore.token
      }
    }
    notificationStore.notifyWaitOn('logging_out', 'Logging out')
    apiClient.post('/auth/token/logout/', {}, config)
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
  createCollective: (collective: Collective) => {
    // Creates collective in the backend. Note: Doesn not add collective in store.
    const sessionStore = useSessionStore()
    const notificationStore = useNotificationStore()
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
    notificationStore.notifyWaitOn('creating_collective', 'Creating collective ' + collective.title)
    console.log('POST', path, dataOut)
    apiClient.post(path, dataOut, config)
    .then(response => {
      notificationStore.notifyWaitOff('creating_collective')
      if (response.status === 201) {
        notificationStore.notifySuccess('collective_created', 'Created new collective: ' + collective.title)
      } else {
        notificationStore.notifyError('Expected status code 201, server returned code:' + response.status)
        console.log(response.data)
      }
    })
    .catch(error => {
      notificationStore.notifyWaitOff('creating_collective')
      const message = 'Failed to create collective: ' + collective.name + '. '
      handleApiError(error, message)
    })
  },
  deleteCollective: (collective: Collective) => {
    console.log('EventService:deleteCollective()')
    const sessionStore = useSessionStore()
    const notificationStore = useNotificationStore()
    const path: string = '/api/collective/' + collective.name + '/'
    const config = {
      headers: {
        'Authorization': 'Token ' + sessionStore.token
      }
    }
    notificationStore.notifyWaitOn('deleting_collective', 'Deleting collective ' + collective.title)
    apiClient.delete(path, config)
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
  }
}
