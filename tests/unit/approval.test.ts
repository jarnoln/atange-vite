import { describe, expect, it } from 'vitest'
import { Answer } from '../../src/types'
import { approval } from '../../src/utils/approval'


it('should have valid values if no answers', () => {
  // Arrange
  const answers = []

  // Act
  const result = approval(answers)

  // Assert
  expect(result.votes).toBe(0)
  expect(result.yes).toBe(0)
  expect(result.abstain).toBe(0)
  expect(result.votes).toBe(0)
  expect(result.approvalPct).toBe(undefined)
})

it('should be 100 with one yes vote', () => {
  // Arrange
  const answers : Answer[] = []
  answers.push({ question: 'q1', user: 'u1', vote: 1, comment: ''})

  // Act
  const result = approval(answers)

  // Assert
  expect(result.votes).toBe(1)
  expect(result.opinions).toBe(1)
  expect(result.yes).toBe(1)
  expect(result.no).toBe(0)
  expect(result.abstain).toBe(0)
  expect(result.approvalPct).toBe(100)
}),

it('should be undefined with one abstain vote', () => {
  // Arrange
  const answers : Answer[] = []
  answers.push({ question: 'q1', user: 'u1', vote: 0, comment: ''})

  // Act
  const result = approval(answers)

  // Assert
  expect(result.votes).toBe(1)
  expect(result.yes).toBe(0)
  expect(result.no).toBe(0)
  expect(result.abstain).toBe(1)
  expect(result.opinions).toBe(0)
  expect(result.approvalPct).toBe(undefined)
})

it('should be 0 with one no vote', () => {
  // Arrange
  const answers : Answer[] = []
  answers.push({ question: 'q1', user: 'u1', vote: -1, comment: ''})

  // Act
  const result = approval(answers)

  // Assert
  expect(result.votes).toBe(1)
  expect(result.yes).toBe(0)
  expect(result.no).toBe(1)
  expect(result.abstain).toBe(0)
  expect(result.opinions).toBe(1)
  expect(result.approvalPct).toBe(0)
})

it('should be 0 with one no vote', () => {
  // Arrange
  const answers : Answer[] = []
  answers.push({ question: 'q1', user: 'u1', vote: -1, comment: ''})

  // Act
  const result = approval(answers)

  // Assert
  expect(result.votes).toBe(1)
  expect(result.yes).toBe(0)
  expect(result.no).toBe(1)
  expect(result.abstain).toBe(0)
  expect(result.opinions).toBe(1)
  expect(result.approvalPct).toBe(0)
})

it('should be 50 with one vote of each type', () => {
  // Arrange
  const answers : Answer[] = []
  answers.push({ question: 'q1', user: 'u1', vote: 1, comment: ''})
  answers.push({ question: 'q1', user: 'u2', vote: 0, comment: ''})
  answers.push({ question: 'q1', user: 'u3', vote: -1, comment: ''})

  // Act
  const result = approval(answers)

  // Assert
  expect(result.votes).toBe(3)
  expect(result.yes).toBe(1)
  expect(result.no).toBe(1)
  expect(result.abstain).toBe(1)
  expect(result.opinions).toBe(2)
  expect(result.approvalPct).toBe(50)
})

it('should be 33.3 with one yes and two no', () => {
  // Arrange
  const answers : Answer[] = []
  answers.push({ question: 'q1', user: 'u1', vote: 1, comment: ''})
  answers.push({ question: 'q1', user: 'u2', vote: -1, comment: ''})
  answers.push({ question: 'q1', user: 'u3', vote: -1, comment: ''})

  // Act
  const result = approval(answers)

  // Assert
  expect(result.votes).toBe(3)
  expect(result.yes).toBe(1)
  expect(result.no).toBe(2)
  expect(result.abstain).toBe(0)
  expect(result.opinions).toBe(3)
  expect(result.approvalPct).toBe(100/3)
})
