import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi, vitest } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '../../src/routes'
import { useCollectiveStore } from '../../src/stores/CollectiveStore'
import { useSessionStore } from '../../src/stores/SessionStore'
import CollectiveBaseView from '../../src/views/CollectiveBaseView.vue'


const pinia = createTestingPinia({
  createSpy: vitest.fn,
  stubActions: false
})

const router = createRouter({
  history: createWebHistory(), // Use browser built-in history
  routes: routes
})

vi.mock('axios')

const collectiveStore = useCollectiveStore()
const sessionStore = useSessionStore()


describe('Test CollectiveBaseView', () => {
  it('show collective information', async () => {
    collectiveStore.clear()
    const collective = {
      name: 'jla',
      title: 'JLA',
      description: 'Justice League of America',
      creator: 'superman',
      permissions: {
        canEdit: true,
        canJoin: true
      }
    }
    collectiveStore.addCollective(collective.name, collective.title, collective.description, collective.creator)
    expect(collectiveStore.collectives.length).toBe(1)
    expect(collectiveStore.currentCollective).toBe(undefined)
    sessionStore.login('superman', 'abcd')
    const wrapper = mount(CollectiveBaseView, {
      props: {
        collectiveName: collective.name
      },
      global: {
        plugins: [pinia, router]
      }
    })
    await nextTick()
    expect(collectiveStore.currentCollective).toEqual(collective)
    const title = wrapper.get('#collective-title')
    expect(title.isVisible()).toBe(true)
    expect(title.text()).toBe(collective.title)
  }),
  it('show unknown if collective does not exist', () => {
    collectiveStore.clear()
    const wrapper = mount(CollectiveBaseView, {
      props: {
        collectiveName: 'outsiders'
      },
      global: {
        plugins: [pinia, router]
      }
    })
    expect(wrapper.text()).toContain('Unknown collective')
  }),
  it('shows "Edit collective"-button when logged and have edit permission', async () => {
    sessionStore.login('superman', 'abcd')
    collectiveStore.updateCollectivePermissions('jla', { canEdit: true, canJoin: true })
    const wrapper = mount(CollectiveBaseView, {
      props: {
        collectiveName: 'jla'
      },
      global: {
        plugins: [pinia, router]
      }
    })
    const viewLink = wrapper.get('#collective-view-link')
    const editLink = wrapper.get('#collective-edit-link')
    const reorderLink = wrapper.get('#collective-reorder-link')
    expect(viewLink.exists()).toBe(true)
    expect(editLink.exists()).toBe(true)
    expect(reorderLink.exists()).toBe(true)
    expect(viewLink.text()).toBe("Questions")
    expect(editLink.text()).toBe("Edit")
    expect(reorderLink.text()).toBe("Reorder")
  }),
  it('does not show "Edit"-link if no edit permission', async () => {
    sessionStore.login('batman', 'abcd')
    const wrapper = mount(CollectiveBaseView, {
      props: {
        collectiveName: 'jla'
      },
      global: {
        plugins: [pinia, router]
      }
    })
    const editLink = wrapper.find('#collective-edit-link')
    const reorderLink = wrapper.find('#collective-reorder-link')
    expect(editLink.exists()).toBe(false)
    expect(reorderLink.exists()).toBe(false)
  }),
  it('does not show "Edit"-link if not logged in', async () => {
    const wrapper = mount(CollectiveBaseView, {
      props: {
        collectiveName: 'jla'
      },
      global: {
        plugins: [pinia, router]
      }
    })
    const editLink = wrapper.find('#collective-edit-link')
    const reorderLink = wrapper.find('#collective-reorder-link')
    expect(editLink.exists()).toBe(false)
    expect(reorderLink.exists()).toBe(false)
  })
})
