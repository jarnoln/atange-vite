import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, test, vi, vitest } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '../../src/routes'
import { useCollectiveStore } from '../../src/stores/CollectiveStore'
import { useSessionStore } from '../../src/stores/SessionStore'
import EditQuestion from '../../src/components/EditQuestion.vue'


vi.mock('axios')

const router = createRouter({
    history: createWebHistory(), // Use browser built-in history
    routes: routes
})

const pinia = createTestingPinia({
    createSpy: vitest.fn,
})

describe('Test EditQuestion', () => {
    test('test using test utils', async () => {
        const collectiveStore = useCollectiveStore()
        const sessionStore = useSessionStore()
        sessionStore.login('superman', 'abcd')
        collectiveStore.addCollective('jsa', 'JSA', '', 'superman')
        collectiveStore.updateCollectivePermissions('jsa', { canEdit: true, canJoin: true })
        collectiveStore.selectCollective('jsa')
        const wrapper = mount(EditQuestion, {
            global: {
                plugins: [router, pinia]
            },
            props: {
                questionName: ''
            }
        })
        expect(wrapper.text()).toContain('Title')
        expect(wrapper.text()).toContain('Name')
        expect(wrapper.text()).toContain('Description')
        const nameInput = wrapper.get('#question-name')
        const titleInput = wrapper.get('#question-title')
        const descriptionInput = wrapper.get('#question-description')
        const submitButton = wrapper.get('#question-submit-button')
        expect(nameInput.isVisible()).toBe(true)
        expect(titleInput.isVisible()).toBe(true)
        expect(submitButton.isVisible()).toBe(true)
        expect(submitButton.attributes().disabled).toBe('true')
        nameInput.setValue('q1')
        titleInput.setValue('Question 1')
        descriptionInput.setValue('Important question')
        await nextTick()
        // expect(collectiveCreateButton.attributes().disabled).toBeUndefined()
        submitButton.trigger('click')
    })
})
