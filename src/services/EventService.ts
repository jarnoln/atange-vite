import { useCollectiveStore } from '../stores/CollectiveStore'
import { Collective } from '../types'


function storeCollectives(collectiveData: Collective[]) {
  const collectiveStore = useCollectiveStore()
  collectiveData.forEach(item => {
    collectiveStore.addCollective({
        name: item.name,
        title: item.title
    })
  })
}

// For some reason unit teste were not able to call fetchCollectives
// so moved functionality out here so that can test until can
// figure out way to test method
export function outerFetchCollectives() {
  const server: string = 'http://127.0.0.1:8000'
  const path: string = '/api/collectives/'
  const url = server + path
  fetch(url)
      .then(response => response.json())
      .then(data => storeCollectives(data))
}

export default {
    fetchCollectives() {
      // Fetch collective list from backend
      outerFetchCollectives()
    }
}
