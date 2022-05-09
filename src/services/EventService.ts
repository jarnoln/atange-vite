import { useCollectiveStore } from '../stores/CollectiveStore'
import { useSessionStore } from '../stores/SessionStore'
import { Collective } from '../types'


const server: string = 'http://127.0.0.1:8000'

function storeCollectives(collectiveData: Collective[]) {
  const collectiveStore = useCollectiveStore()
  collectiveData.forEach(item => {
    collectiveStore.addCollective({
        name: item.name,
        title: item.title,
        description: ''
    })
  })
}

// For some reason unit teste were not able to call fetchCollectives
// so moved functionality out here so that can test until can
// figure out way to test method
export function fetchCollectives() {
  const path: string = '/api/collectives/'
  const url = server + path
  fetch(url)
      .then(response => response.json())
      .then(data => storeCollectives(data))
}

export function createCollective(collective: Collective) {
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
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataOut)
  }
  fetch(url, options)
    .then(response => response.json())
    .then(data => console.log(data))
}

export function register(username: string, password: string) {
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
  fetch(url, options)
    .then(response => response.json())
    .then(data => console.log(data))
}

export function login(username: string, password: string) {
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
  fetch(url, options)
    .then(response => {
      console.log(response.status)
      if (response.status === 200) {
        return response.json()
      }
    })
    .then(data => {
      console.log(data)
      const token = data['auth_token']
      const sessionStore = useSessionStore()
      sessionStore.login(username, token)
    })
}
