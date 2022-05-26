export interface Collective {
    name: string
    title: string
    description: string
}

export interface Question {
    name: string
    title: string
    description: string
    itemType: string
    order: number
    parent: string
    creator: string
}

export interface Notification {
    id: string,
    message: string
    class: string
    details: string
    needAck: boolean
    ack: boolean
}
