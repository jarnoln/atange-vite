import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, test, vitest } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import CollectiveView from '../../src/views/CollectiveView.vue'


const pinia = createPinia()
setActivePinia(pinia)


describe('Test CollectiveView', () => {
    test('test using test utils', async () => {
        const wrapper = mount(CollectiveView, {
            props: {
                collectiveName: 'jla'
            },
            global: {
                plugins: [pinia]
            }

        })
        expect(wrapper.text()).toContain('Unknown collective')
    })
})
