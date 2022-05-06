import { describe, expect, it } from 'vitest'
import { validateStringLongEnough, validateStringNotDuplicate } from '../../src/utils/validators'


describe('validateStringLongEnough()', () => {
    it('should be invalid if string too short', () => {
        // Arrange
        const inputName: string = 'Username'
        const inputValue: string = ''
        const minLength: number = 1

        // Act
        const result = validateStringLongEnough(inputName, inputValue, minLength)

        // Assert
        expect(result).toBeTypeOf("string")
        expect(result).toBe('Username should be at least 1 characters long')
    }),
    it('should be valid if string long enough', () => {
        // Arrange
        const inputName: string = 'Testing'
        const inputValue: string = 'test'
        const minLength: number = 1

        // Act
        const result = validateStringLongEnough(inputName, inputValue, minLength)

        // Assert
        expect(result).toBe('')
    }),
    it('should fail if no args', () => {
        const resultFn = () => {
            validateStringLongEnough()
        }
        expect(resultFn).toThrow(Error)
        expect(resultFn).toThrow(/minLength should be a positive number/)
    })
})

describe('validateStringNotDuplicate()', () => {
    it('should be invalid if string already in array', () => {
        const inputValue: string = 'superman'
        const userNames: string[] = ['batman', 'superman']

        const result = validateStringNotDuplicate(inputValue, userNames)

        expect(result).toBe('superman is already in use')
    }),
    it('should be valid if string not already in array', () => {
        const inputValue: string = 'aquaman'
        const userNames: string[] = ['batman', 'superman']

        const result = validateStringNotDuplicate(inputValue, userNames)

        expect(result).toBe('')
    })
})
