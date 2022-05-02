import { render, fireEvent } from '@testing-library/vue'
import { assert, describe, expect, test, vitest } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import CollectiveList from '../../src/components/CollectiveList.vue'


test('increments value on click', async () => {
    // The render method returns a collection of utilities to query your component.
    createTestingPinia({
        createSpy: vitest.fn
    })
    const {getByText} = render(CollectiveList)

    // getByText returns the first matching node for the provided text, and
    // throws an error if no elements match or if more than one match is found.
    getByText('Collectives: 3')

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
})
