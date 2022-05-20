import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, test, vi, vitest } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '../../src/routes'
import EditCollective from '../../src/components/EditCollective.vue'

vi.mock('axios')

const router = createRouter({
    history: createWebHistory(), // Use browser built-in history
    routes: routes
})

const pinia = createTestingPinia({
    createSpy: vitest.fn,
})

describe('Test EditCollective', () => {
    test('test using test utils', async () => {
        const wrapper = mount(EditCollective, {
            global: {
                plugins: [router, pinia]
            }
        })
        expect(wrapper.text()).toContain('Title')
        expect(wrapper.text()).toContain('Name')
        const collectiveNameInput = wrapper.get('#collective-name')
        const collectiveTitleInput = wrapper.get('#collective-title')
        const collectiveCreateButton = wrapper.get('#collective-create-button')
        expect(collectiveNameInput.isVisible()).toBe(true)
        expect(collectiveTitleInput.isVisible()).toBe(true)
        expect(collectiveCreateButton.isVisible()).toBe(true)
        expect(collectiveCreateButton.attributes().disabled).toBe('true')
        collectiveNameInput.setValue('jla')
        collectiveTitleInput.setValue('JLA')
        await nextTick()
        // expect(collectiveCreateButton.attributes().disabled).toBeUndefined()
        collectiveCreateButton.trigger('click')
    })
})
