import axios from 'axios'

import { useCollectiveStore } from '../stores/CollectiveStore'
import { useSessionStore } from '../stores/SessionStore'
import { useNotificationStore } from '../stores/NotificationStore'
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
  collectiveData.forEach(item => {
    collectiveStore.addCollective({
      name: item.name,
      title: item.title,
      description: ''
    })
  })
}

export const EventService = {
// For some reason unit tests were not able to call fetchCollectives
// so moved functionality out here so that can test until can
// figure out way to test method
  fetchCollectives: () => {
    const path: string = '/api/collectives/'
    apiClient.get(path).then(response =>
      storeCollectives(response.data)
    )
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
      const token = response.data['auth_token']
      sessionStore.login(username, token)
      notificationStore.notifyLoggingInOff()
    })
    .catch(error => {
      notificationStore.notifyLoggingInOff()
      if (error.response) {
        notificationStore.notifyError('Failed to log in. Server returned status code:' + error.response.status)
        console.log(error.response.data)
      } else {
        notificationStore.notifyError('Something went wrong when tryin to log in')
      }
      console.log(error)
      sessionStore.login('', '')
    })
  },
  register: (username: string, password: string) => {
    const sessionStore = useSessionStore()
    const notificationStore = useNotificationStore()
    notificationStore.notifyRegisteringOn()

    // const url = server + '/auth/users/'
    const dataOut = {
      username: username,
      password: password
    }

    apiClient.post('/auth/users/', dataOut)
    .then(response => {
      notificationStore.notifyRegisteringOff()
      if (response.data['username'] === username ) {
        console.log('New user registered:', username)
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
    const dataOut = {}
    const config = {
      headers: {
        'Authorization': 'Token ' + sessionStore.token
      }
    }
    apiClient.post('/auth/token/logout/', dataOut, config)
    .then(response => {
      console.log('Logged out')
      console.log(response)
    })
    .catch(error => {
      const message = 'Failed to log out. '
      if (error.response) {
        console.log('error.response.data:', error.response.data)
        notificationStore.notifyError(message + 'Server returned status code:' + error.response.status)
      } else {
        notificationStore.notifyError(message)
      }
    })
  },
  createCollective: (collective: Collective) => {
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
    apiClient.post(path, dataOut, config)
    .then(response => {
      console.log('Collective', collective.name, 'created')
      console.log(response)
      if (response.status != 201) {
        console.log('Something went wrong.')
      }
    })
    .catch(error => {
      const message = 'Failed to create collective: ' + collective.name + '. '
      if (error.response) {
        console.log('error.response.data:', error.response.data)
        notificationStore.notifyError(message + 'Server returned status code:' + error.response.status)
      } else {
        notificationStore.notifyError(message)
      }
    })
  },
  deleteCollective: (collective: Collective) => {
    const sessionStore = useSessionStore()
    const notificationStore = useNotificationStore()
    const path: string = '/api/collective/' + collective.name + '/'
    const config = {
      headers: {
        'Authorization': 'Token ' + sessionStore.token
      }
    }
    apiClient.delete(path, config)
    .then(response => {
      console.log('Collective', collective.name, 'deleted')
      console.log(response)
      if (response.status != 204) {
        console.log('Something went wrong.')
      }
    })
    .catch(error => {
      const message = 'Failed to delete collective: ' + collective.name + '. '
      if (error.response) {
        console.log('error.response.data:', error.response.data)
        notificationStore.notifyError(message + 'Server returned status code:' + error.response.status)
      } else {
        notificationStore.notifyError(message)
      }
    })
  }
}
