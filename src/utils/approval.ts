import { assert } from '@vue/compiler-core'
import { Answer, Approval } from '../types'

export function approval(answers: Answer[]) : Approval {
  /*
  * Approval is the percentage of 'yes'-votes among 'yes' and 'no'-votes (abstains are ignored)
  * 100% => Everybody votes Yes
  * 50% => Half vote Yes, half No
  * 0% => No Yes votes
  */
  let yesCount = 0
  let noCount = 0
  let abstainCount = 0
  let opinionCount = 0
  const voteCount = answers.length
  answers.forEach(answer => {
    if (answer.vote === 1) {
      opinionCount += 1
      yesCount += 1
    } else if (answer.vote === -1) {
      opinionCount += 1
      noCount += 1
    } else if (answer.vote === 0) {
      abstainCount += 1
    }
  })
  assert ((yesCount + noCount + abstainCount) === voteCount)
  let approvalPct = undefined
  if (opinionCount > 0) {
    approvalPct = yesCount * 100 / opinionCount
  }
  return {
    yes: yesCount,
    no: noCount,
    abstain: abstainCount,
    opinions: opinionCount,
    votes: voteCount,
    approvalPct: approvalPct
  }
}
