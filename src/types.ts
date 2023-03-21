export interface Collective {
  name: string
  title: string
  description: string
  isVisible: boolean
  creator: string
  permissions: Permissions
}

export interface User {
  username: string
  firstName: string
  lastName: string
}

export interface UserGroup {
  name: string
  title: string
  type: string
  collective: string
  members: string[]
}

export interface Permissions {
  canEdit: boolean
  canJoin: boolean
}

export interface Answer {
  question: string
  user: string
  vote: number
  comment: string
}

export interface Question {
    name: string
    title: string
    description: string
    itemType: string
    order: number
    parent: string
    creator: string
    answers: Answer[]
}

export interface Candidate {
  username: string
  firstName: string
  lastName: string
  party: UserGroup | null
  district: UserGroup | null
  candidateNumber: number
  homepage: string
  description: string
  answers: Answer[]
}

export interface Notification {
    id: string,
    message: string
    class: string
    details: string
    needAck: boolean
    ack: boolean
}

export interface Approval {
  yes: number
  no: number
  abstain: number
  opinions: number
  votes: number
  approvalPct: number | null
}
