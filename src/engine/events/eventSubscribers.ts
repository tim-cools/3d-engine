import {Event} from "./event"
import {EventType} from "./eventType"

type EventHandler = (event: any) => void

export class EventSubscription {

  private handlerValue: WeakRef<EventHandler>

  type: EventType

  get handler(): EventHandler | undefined {
    return this.handlerValue.deref()
  }

  constructor(type: EventType, handlerValue: EventHandler) {
    this.type = type
    this.handlerValue = new WeakRef<EventHandler>(handlerValue)
  }
}

export class EventSubscribers {

  private subscribers: EventSubscription[] = []

  add<TEvent extends Event>(type: EventType, handler: (event: TEvent) => void): void {
    const subscription = new EventSubscription(type, value => handler(value as TEvent))
    this.subscribers.push(subscription)
  }

  publish(type: EventType, event: Event) {
    for (let index = 0; index < this.subscribers.length; ){
      const subscriber = this.subscribers[index]
      if (subscriber.type == type) {
        if (subscriber.handler == undefined) {
          this.subscribers.splice(index, 1)
        } else {
          subscriber.handler(event)
          index++
        }
      } else {
        index++
      }
    }
  }
}
