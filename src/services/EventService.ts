import { useCollectiveStore } from '../stores/CollectiveStore'
import { useSessionStore } from '../stores/SessionStore'
import { useNotificationStore } from '../stores/NotificationStore'
import { Collective } from '../types'


const server: string = 'http://127.0.0.1:8000'


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
    const url = server + path
    fetch(url)
        .then(response => response.json())
        .then(data => storeCollectives(data))
  },
  login: (username: string, password: string) => {
    const url = server + '/auth/token/login/'
    const dataOut = {
      username: username,
      password: password
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataOut)
    }
    const sessionStore = useSessionStore()
    const notificationStore = useNotificationStore()
    notificationStore.notifyLoggingInOn()
    fetch(url, options)
      .then(response => {
        console.log(response.status)
        if (response.status === 200) {
          return response.json()
        } else {
          notificationStore.notifyLoggingInOff()
          notificationStore.notifyError('Failed to log in. Server returned status code:' + response.status)
          sessionStore.login('', '')
        }
      })
      .then(data => {
        console.log(data)
        const token = data['auth_token']
        sessionStore.login(username, token)
        notificationStore.notifyLoggingInOff()
      })
      .catch(error => {
        notificationStore.notifyLoggingInOff()
        notificationStore.notifyError('Something went wrong when tryin to log in')
        console.log(error)
        sessionStore.login('', '')
      })
  },
  register: (username: string, password: string) => {
    const url = server + '/auth/users/'
    const dataOut = {
      username: username,
      password: password
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataOut)
    }
    const sessionStore = useSessionStore()
    const notificationStore = useNotificationStore()
    notificationStore.notifyRegisteringOn()

    fetch(url, options)
      .then(response => {
        console.log(response.status)
        if (response.status === 200) {
          return response.json()
        } else {
          notificationStore.notifyRegisteringOff()
          notificationStore.notifyError('Failed to register. Server returned status code:' + response.status)
        }
        response.json()
      })
      .then(data => {
        console.log(data)
        if (data.username === username) {
          notificationStore.notifyRegisteringOff()
          console.log('New user registered:', data.username)
        }
      })
      .catch(error => {
        notificationStore.notifyRegisteringOff()
        notificationStore.notifyError('Something went wrong when tryin to register user:' + username)
        console.log(error)
      })
  },
  logout: () => {
    const sessionStore = useSessionStore()
    const url = server + '/auth/token/logout/'
    const dataOut = {}
    const options = {
      method: 'POST',
      headers: {
        'Authorization': 'Token ' + sessionStore.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataOut)
    }
    fetch(url, options)
      .then(response => {
        console.log(response.status)
        if (response.status === 204) {
          console.log('Logged out')
        } else {
          console.log('Failed to log out. Server returned status code:', response.status)
        }
      })
      .catch(error => {
        console.log('Something went wrong when tryin to log out')
        console.log(error)
      })
  },
  createCollective: (collective: Collective) => {
    const sessionStore = useSessionStore()
    const path: string = '/api/collective/' + collective.name + '/'
    const url = server + path
    const dataOut = {
      name: collective.name,
      title: collective.title,
      description: collective.description,
      is_visible: true,
    }
    const options = {
      method: 'POST',
      headers: {
        'Authorization': 'Token ' + sessionStore.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataOut)
    }
    fetch(url, options)
      .then(response => response.json())
      .then(data => console.log(data))
  },
  deleteCollective: (collective: Collective) => {
    const sessionStore = useSessionStore()
    const path: string = '/api/collective/' + collective.name + '/'
    const url = server + path
    const dataOut = {}
    const options = {
      method: 'DELETE',
      headers: {
        'Authorization': 'Token ' + sessionStore.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataOut)
    }
    fetch(url, options)
      .then(response => {
        console.log(response.status)
        if (response.status === 204) {
          console.log('Collective', collective.name,'deleted from server')
        }
      })
      .catch(error => {
        console.log('Failed to delete collective:', collective.name)
        console.log(error)
      })
  }  
}
