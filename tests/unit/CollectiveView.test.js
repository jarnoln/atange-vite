import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
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
