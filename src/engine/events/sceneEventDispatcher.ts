import {Event} from "./event"
import {EventType} from "./eventType"
import {EventDispatcher} from "./eventDispatcher"
import {GlobalEventDispatcher} from "./globalEventDispatcher"
import {EventSubscribers} from "./eventSubscribers"

export class SceneEventDispatcher implements EventDispatcher {

  private globalEventDispatcher: GlobalEventDispatcher
  private subscribers: EventSubscribers = new EventSubscribers()

  constructor(globalEventDispatcher: GlobalEventDispatcher) {
    this.globalEventDispatcher = globalEventDispatcher
  }

  subscribe<TEvent extends Event>(type : new () => TEvent, handler: (event: TEvent) => void): void {
    const eventType = new type().eventType
    this.subscribers.add(eventType, handler)
  }

  publish<TEvent extends Event>(type : new () => TEvent, event: TEvent): void {
    const eventType = new type().eventType
    this.globalEventDispatcher.publishGlobal(eventType, event)
    this.publishForScene(eventType, event)
  }

  publishForScene(type: EventType, event: Event) {
    this.subscribers.publish(type, event)
  }
}
