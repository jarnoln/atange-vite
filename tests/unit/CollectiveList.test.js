import { nextTick } from 'vue'
import { render, fireEvent } from '@testing-library/vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, test, vi, vitest } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '../../src/routes'
import { useSessionStore } from '../../src/stores/SessionStore'
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

const sessionStore = useSessionStore()

describe('Test CollectiveList', () => {
  test('test show collective titles', async () => {
    // The render method returns a collection of utilities to query your component.
    const { getByText } = render(CollectiveList, {
      global: {
        plugins: [router, pinia]
      }
    })
    // getByText returns the first matching node for the provided text, and
    // throws an error if no elements match or if more than one match is found.
    getByText('Collectives: 0')
    await nextTick()
    getByText('Collectives: 3')
    getByText('JLA')
    getByText('JSA')
    getByText('Section 8')

    sessionStore.login('superman', 'abcd')
    await nextTick()
    const button1 = getByText('Delete JSA')
    const button2 = getByText('Delete JLA')
    const button3 = getByText('Delete Section 8')

    // Dispatch a native click event to our button element.
    await fireEvent.click(button1)
    getByText('Collectives: 2')

    await fireEvent.click(button2)
    getByText('Collectives: 1')

    await fireEvent.click(button3)
    getByText('Collectives: 0')
  }),
  test('test using test utils', async () => {
    const wrapper = mount(CollectiveList, {
      global: {
        plugins: [router, pinia]
      }
    })
    await nextTick()
    expect(wrapper.text()).toContain('Collectives: 3')
    const collectiveCountText = wrapper.get('#collective-count')
    expect(collectiveCountText.text()).toEqual('Collectives: 3')
  })
})
