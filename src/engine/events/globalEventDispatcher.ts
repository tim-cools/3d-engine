import {SceneEventDispatcher} from "./sceneEventDispatcher"
import {Event} from "./event"
import {EventType} from "./eventType"
import {EventDispatcher} from "./eventDispatcher"
import {EventSubscribers} from "./eventSubscribers"
import {UIElement} from "../ui/uiElement"
import {MouseDown, MouseEnter, MouseLeave, MouseOver} from "./update"
import {Point2D} from "../models"
import {nothing, Nothing} from "../nothing"

export class GlobalEventDispatcher implements EventDispatcher {

  private elementMousIn: UIElement[] = []

  private currentScene: SceneEventDispatcher = new SceneEventDispatcher(this)
  private subscribers: EventSubscribers = new EventSubscribers()

  subscribe<TEvent extends Event>(type : new () => TEvent, element: UIElement | Nothing, handler: (event: TEvent) => void): void {
    const eventType = new type().eventType
    this.subscribers.add(eventType, element, handler)
  }

  publish<TEvent extends Event>(type : new () => TEvent, event: TEvent): void {
    const eventType = new type().eventType
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

  moveMouse(point: Point2D) {
    this.handleMouseOver(point)
    this.handleMouseEnterLeave(point)
  }

  mouseDown(point: Point2D) {
    const subscribers = this.getSubscribers(MouseDown)
    for (const subscriber of subscribers) {
      if (subscriber.element && subscriber.element.lastArea.contains(point) && subscriber.handler != undefined) {
        subscriber.handler(new MouseDown())
      }
    }
  }

  private handleMouseOver(point: Point2D) {
    const subscribers = this.getSubscribers(MouseOver)
    for (const subscriber of subscribers) {
      if (subscriber.element && subscriber.element.lastArea.contains(point) && subscriber.handler != undefined) {
        subscriber.handler(new MouseOver())
      }
    }
  }

  private handleMouseEnterLeave(point: Point2D) {
    const remaining = [...this.elementMousIn]
    this.handleMouseEnter(point, remaining)
    this.handleMouseLeave(remaining)
  }

  private handleMouseEnter(point: Point2D, remaining: UIElement[]) {

    const subscribers = this.getSubscribers(MouseEnter)
    for (let index = 0; index < subscribers.length;) {

      const subscriber = subscribers[index]
      if (subscriber.handler == undefined) {
        this.subscribers.remove(subscriber)
        continue
      }

      if (subscriber.element && subscriber.element.lastArea.contains(point)) {
        let indexOf = remaining.indexOf(subscriber.element)
        if (indexOf < 0) {
          subscriber.handler(new MouseEnter())
          console.log("MouseEnter")
          this.elementMousIn.push(subscriber.element)
        } else {
          remaining.splice(indexOf, 1)
        }
        index++
      } else {
        index++
      }
    }
  }

  private handleMouseLeave(remaining: UIElement[]) {
    const subscribersLeave = this.getSubscribers(MouseLeave)
    for (const subscriber of subscribersLeave) {

      if (subscriber.handler == undefined) {
        this.subscribers.remove(subscriber)
        continue
      }

      if (subscriber.element == nothing || remaining.indexOf(subscriber.element) < 0) {
        continue
      }

      const index = this.elementMousIn.indexOf(subscriber.element)
      if (index >= 0) {
        this.elementMousIn.splice(index)
        subscriber.handler(new MouseLeave())
        console.log("MouseLeave")
      }
    }
  }
}
