import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, test, vi, vitest } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '../../src/routes'
import { useCollectiveStore } from '../../src/stores/CollectiveStore'
import { useSessionStore } from '../../src/stores/SessionStore'
import EditCollective from '../../src/components/EditCollective.vue'


const router = createRouter({
  history: createWebHistory(), // Use browser built-in history
  routes: routes
})

const pinia = createTestingPinia({
  createSpy: vitest.fn,
})

vi.mock('axios')

const collectiveStore = useCollectiveStore()
const sessionStore = useSessionStore()

describe('Test EditCollective', () => {
  beforeEach(() => {
    collectiveStore.clear()
    sessionStore.clear()
  }),
  it('can create new collective', async () => {
    expect(collectiveStore.collectives.length).toBe(0)
    sessionStore.login('superman', 'abcd')
    const wrapper = mount(EditCollective, {
      global: {
        plugins: [router, pinia]
      }
    })
    expect(wrapper.text()).toContain('Name')
    expect(wrapper.text()).toContain('Title')
    expect(wrapper.text()).toContain('Description')
    expect(wrapper.text()).toContain('Create')
    const collectiveNameInput = wrapper.get('#collective-name')
    const collectiveTitleInput = wrapper.get('#collective-title')
    const collectiveDescriptionInput = wrapper.get('#collective-description')
    const collectiveSubmitButton = wrapper.get('#collective-submit-button')
    expect(collectiveNameInput.isVisible()).toBe(true)
    expect(collectiveTitleInput.isVisible()).toBe(true)
    expect(collectiveSubmitButton.isVisible()).toBe(true)
    expect(collectiveSubmitButton.attributes().disabled).toBe('true')
    expect(collectiveSubmitButton.text()).toBe('Create')
    collectiveNameInput.setValue('jla')
    collectiveTitleInput.setValue('JLA')
    collectiveDescriptionInput.setValue('Justice League of America')
    // expect(collectiveCreateButton.attributes().disabled).toBeUndefined()
    collectiveSubmitButton.trigger('click')
    await nextTick()
    // expect(collectiveStore.collectives.length).toBe(1)
  }),
  it('can edit existing collective', async () => {
    collectiveStore.addCollective('jsa', 'JSA', 'Justice League of America', true, 'superman')
    collectiveStore.updateCollectivePermissions('jsa', { canEdit: true, canJoin: true })
    collectiveStore.selectCollective('jsa')
    sessionStore.login('superman', 'abcd')
    const wrapper = mount(EditCollective, {
      global: {
        plugins: [router, pinia]
      }
    })
    await nextTick()
    const collectiveTitleInput = wrapper.get('#collective-title')
    const collectiveDescriptionInput = wrapper.get('#collective-description')
    const collectiveSubmitButton = wrapper.get('#collective-submit-button')
    expect(collectiveSubmitButton.text()).toBe('Save')
    collectiveTitleInput.setValue('JC')
    collectiveDescriptionInput.setValue('Justice Club')
    collectiveSubmitButton.trigger('click')
    await nextTick()
    expect(collectiveStore.collectives.length).toBe(1)
    // expect(collectiveStore.collectives[0].title).toBe('JC')
    // expect(collectiveStore.collectives[0].description).toBe('Justice Club')
    // expect(collectiveSubmitButton.attributes().disabled).toBe('true')
  }),
  it('can delete collective', async () => {
    collectiveStore.addCollective('jsa', 'JSA', '', true, 'superman')
    collectiveStore.updateCollectivePermissions('jsa', { canEdit: true, canJoin: true })
    collectiveStore.selectCollective('jsa')
    sessionStore.login('superman', 'abcd')
    const wrapper = mount(EditCollective, {
      global: {
        plugins: [router, pinia]
      }
    })
    expect(wrapper.text()).toContain('Title')
    expect(wrapper.text()).toContain('Description')
    expect(wrapper.text()).toContain('Delete')
    const deleteButton = wrapper.get('#delete-collective-btn')
    expect(collectiveStore.collectives.length).toBe(1)
    deleteButton.trigger('click')
    await nextTick()
    expect(collectiveStore.collectives.length).toBe(0)
    expect(collectiveStore.currentCollective).toBe(undefined)
  }),
  it('does not show inputs if not logged in', async () => {
    expect(collectiveStore.collectives.length).toBe(0)
    const wrapper = mount(EditCollective, {
      global: {
        plugins: [router, pinia]
      }
    })
    expect(wrapper.text()).not.toContain('Title')
    expect(wrapper.text()).not.toContain('Name')
    expect(wrapper.text()).not.toContain('Description')
    expect(wrapper.text()).not.toContain('Create')
    expect(wrapper.text()).not.toContain('Cancel')
  }),
  it('does not show inputs if no permission to edit', async () => {
    collectiveStore.addCollective('jsa', 'JSA', '', true, 'superman')
    collectiveStore.updateCollectivePermissions('jsa', { canEdit: false, canJoin: true })
    collectiveStore.selectCollective('jsa')
    sessionStore.login('superman', 'abcd')
    const wrapper = mount(EditCollective, {
      global: {
        plugins: [router, pinia]
      }
    })
    expect(wrapper.text()).not.toContain('Title')
    expect(wrapper.text()).not.toContain('Name')
    expect(wrapper.text()).not.toContain('Description')
    expect(wrapper.text()).not.toContain('Save')
    expect(wrapper.text()).not.toContain('Delete')
  })
})
