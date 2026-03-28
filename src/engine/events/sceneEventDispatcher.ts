import {Event} from "./event"
import {EventType} from "./eventType"
import {EventDispatcher} from "./eventDispatcher"
import {ApplicationEventDispatcher} from "./applicationEventDispatcher"
import {EventSubscribers} from "./eventSubscribers"
import {UIElement} from "../ui/uiElement"

export class SceneEventDispatcher implements EventDispatcher {

  private globalEventDispatcher: ApplicationEventDispatcher
  private subscribers: EventSubscribers = new EventSubscribers()

  constructor(globalEventDispatcher: ApplicationEventDispatcher) {
    this.globalEventDispatcher = globalEventDispatcher
  }

  subscribe<TEvent extends Event>(type : new () => TEvent, element: UIElement, handler: (event: TEvent) => void): void {
    this.globalEventDispatcher.subscribe(type, element, handler)
  }

  unsubscribeElement(element: UIElement): void {
    this.globalEventDispatcher.unsubscribeElement(element)
  }

  publish<TEvent extends Event>(event: TEvent): void {
    const eventType = event.eventType
    this.globalEventDispatcher.publishGlobal(eventType, event)
    this.publishForScene(eventType, event)
  }

  publishForScene(type: EventType, event: Event) {
    this.subscribers.publish(type, event)
  }
}
