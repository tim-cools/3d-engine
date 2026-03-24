import {Event} from "./event"
import {EventType} from "./eventType"
import {UIElement} from "../ui/uiElement"
import {Nothing} from "../nothing"

type EventHandler = (event: any) => void

export class EventSubscription {

  private handlerValue: EventHandler

  readonly type: EventType
  readonly element: UIElement | Nothing

  get handler(): EventHandler | undefined {
    return this.handlerValue
  }

  constructor(type: EventType, element: UIElement | Nothing, handlerValue: EventHandler) {
    this.type = type
    this.element = element
//    this.handlerValue = new WeakRef<EventHandler>(handlerValue)
    this.handlerValue = handlerValue
  }
}

export class EventSubscribers {

  private subscribers: EventSubscription[] = []

  add<TEvent extends Event>(type: EventType, element: UIElement | Nothing, handler: (event: TEvent) => void): void {
    const subscription = new EventSubscription(type, element, value => handler(value as TEvent))
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

  get(eventType: EventType) {
    return this.subscribers.filter(value => value.type == eventType)
  }

  remove(subscriber: EventSubscription) {
    const index = this.subscribers.indexOf(subscriber)
    if (index >= 0) {
      this.subscribers.splice(index, 1)
    }
  }
}
