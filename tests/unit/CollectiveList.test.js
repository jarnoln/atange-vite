import { nextTick } from 'vue'
import { render, fireEvent } from '@testing-library/vue'
import { beforeEach, describe, expect, test, vi, vitest } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '../../src/routes'
import { useSessionStore } from '../../src/stores/SessionStore'
import { useCollectiveStore } from '../../src/stores/CollectiveStore'
import CollectiveList from '../../src/components/CollectiveList.vue'

vi.mock('axios')

const router = createRouter({
  history: createWebHistory(), // Use browser built-in history
  routes: routes
})

const pinia = createTestingPinia({
  createSpy: vitest.fn,
  stubActions: false
})

const collectiveStore = useCollectiveStore()
const sessionStore = useSessionStore()

describe('Test CollectiveList', () => {
  test('test show collective titles', async () => {
    // The render method returns a collection of utilities to query your component.
    collectiveStore.addCollective('jla', 'JLA', '')
    collectiveStore.addCollective('jsa', 'JSA', '')
    const { getByText } = render(CollectiveList, {
      global: {
        plugins: [router, pinia]
      }
    })
    // getByText returns the first matching node for the provided text, and
    // throws an error if no elements match or if more than one match is found.
    getByText('Collectives: 2')
    getByText('JLA')
    getByText('JSA')

    sessionStore.login('superman', 'abcd')
    await nextTick()
    const button1 = getByText('Delete JSA')
    const button2 = getByText('Delete JLA')

    // Dispatch a native click event to our button element.
    await fireEvent.click(button1)
    getByText('Collectives: 1')

    await fireEvent.click(button2)
    getByText('Collectives: 0')
  })
})
