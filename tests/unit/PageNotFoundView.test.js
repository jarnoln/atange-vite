import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PageNotFoundView from '../../src/views/PageNotFoundView.vue'


describe('Test PageNotFoundView', () => {
  it('shows "Page not found"', () => {
    const wrapper = mount(PageNotFoundView)
    expect(wrapper.text()).toContain('Page not found')
  })
})
