import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AboutView from '../../src/views/AboutView.vue'


describe('Test AboutView', () => {
  it('shows "A simple polling/voting app"', () => {
    const wrapper = mount(AboutView)
    expect(wrapper.text()).toContain('A simple polling/voting app')
  })
})
