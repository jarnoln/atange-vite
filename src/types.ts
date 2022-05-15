export interface Collective {
    name: string
    title: string
    description: string
}

export interface Notification {
    id: string,
    message: string
    class: string
    details: string
    needAck: boolean
    ack: boolean
    delay: number
}
