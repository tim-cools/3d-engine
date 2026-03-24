import {SceneEventDispatcher} from "./sceneEventDispatcher"
import {Event} from "./event"
import {EventType} from "./eventType"
import {EventDispatcher} from "./eventDispatcher"
import {EventSubscribers} from "./eventSubscribers"

export class GlobalEventDispatcher implements EventDispatcher {

  private currentScene: SceneEventDispatcher = new SceneEventDispatcher(this)
  private subscribers: EventSubscribers = new EventSubscribers()

  subscribe<TEvent extends Event>(type : new () => TEvent, handler: (event: TEvent) => void): void {
    const eventType = new type().eventType
    this.subscribers.add(eventType, handler)
  }

  publish<TEvent extends Event>(type : new () => TEvent, event: TEvent): void {
    const eventType = new type().eventType
    this.publishGlobal(eventType, event)
    this.currentScene.publishForScene(eventType, event)
  }

  publishGlobal(type: EventType, event: Event) {
    this.subscribers.publish(type, event)
  }

  newScene() {
    this.currentScene = new SceneEventDispatcher(this)
    return this.currentScene
  }
}
