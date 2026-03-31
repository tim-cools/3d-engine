import {EventType} from "./eventType"

export type EventHandler = () => void
export type Event = { eventType: EventType }
