import { render, fireEvent } from '@testing-library/vue'
import { assert, describe, expect, test } from 'vitest'
// import CollectiveList from '../../src/components/CollectiveList.vue'
import HelloWorld from '../../src/components/HelloWorld.vue'


test('increments count on click', async () => {
    // The render method returns a collection of utilities to query your component.
    const {getByText} = render(HelloWorld)
  
    // getByText returns the first matching node for the provided text, and
    // throws an error if no elements match or if more than one match is found.
    getByText('count is: 0')
  
    const button = getByText('count is: 0')
  
    // Dispatch a native click event to our button element.
    await fireEvent.click(button)
    await fireEvent.click(button)
  
    getByText('count is: 2')
})
