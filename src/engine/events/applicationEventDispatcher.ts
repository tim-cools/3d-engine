import {SceneEventDispatcher} from "./sceneEventDispatcher"
import {Event} from "./event"
import {EventType} from "./eventType"
import {EventDispatcher} from "./eventDispatcher"
import {EventSubscribers} from "./eventSubscribers"
import {UIElement} from "../ui/uiElement"
import {Nothing} from "../../infrastructure/nothing"
import {ElementMouseEventHandler} from "./elementMouseEventHandler"

export class ApplicationEventDispatcher implements EventDispatcher {

  private currentScene: SceneEventDispatcher = new SceneEventDispatcher(this)
  private subscribers: EventSubscribers = new EventSubscribers()

  readonly mouse: ElementMouseEventHandler

  constructor() {
    this.mouse = new ElementMouseEventHandler(this.subscribers)
  }

  subscribe<TEvent extends Event>(type : new () => TEvent, element: UIElement | Nothing, handler: (event: TEvent) => void): void {
    const eventType = new type().eventType
    this.subscribers.add(eventType, element, handler)
  }

  unsubscribeElement(element: UIElement): void {
    this.subscribers.removeByElement(element)
  }

  publish<TEvent extends Event>(event: TEvent): void {
    const eventType = event.eventType
    this.publishGlobal(eventType, event)
    this.currentScene.publishForScene(eventType, event)
  }

  getSubscribers<TEvent extends Event>(type : new () => TEvent) {
    const eventType = new type().eventType
    return this.subscribers.get(eventType)
  }

  publishGlobal(type: EventType, event: Event) {
    this.subscribers.publish(type, event)
  }

  newScene() {
    this.currentScene = new SceneEventDispatcher(this)
    return this.currentScene
  }
}
