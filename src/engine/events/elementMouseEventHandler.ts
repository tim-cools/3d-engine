import {EventSubscribers} from "./eventSubscribers"
import {UIElement} from "../ui/uiElement"
import {MouseDown, MouseEnter, MouseLeave, MouseOver} from "./mouseEvents"
import {Point2D} from "../models"
import {nothing} from "../../infrastructure/nothing"
import {EventType} from "./eventType"

export class ElementMouseEventHandler {

  private elementMouseIn: UIElement[] = []

  constructor(private subscribers: EventSubscribers) {
  }

  move(point: Point2D) {
    this.handleMouseOver(point)
    this.handleMouseEnterLeave(point)
  }

  down(point: Point2D) {
    const subscribers = this.subscribers.get(EventType.MouseDown)
    for (const subscriber of subscribers) {
      if (subscriber.element && subscriber.element.lastArea.contains(point) && subscriber.handler != undefined) {
        subscriber.handler(new MouseDown())
      }
    }
  }

  private handleMouseOver(point: Point2D) {
    const subscribers = this.subscribers.get(EventType.MouseOver)
    for (const subscriber of subscribers) {
      if (subscriber.element && subscriber.element.lastArea.contains(point) && subscriber.handler != undefined) {
        subscriber.handler(new MouseOver())
      }
    }
  }

  private handleMouseEnterLeave(point: Point2D) {
    const remaining = [...this.elementMouseIn]
    this.handleMouseEnter(point, remaining)
    this.handleMouseLeave(remaining)
  }

  private handleMouseEnter(point: Point2D, remaining: UIElement[]) {

    this.subscribers.publishWhen(EventType.MouseEnter, new MouseEnter(), subscriber => {

      if (!subscriber.element || !subscriber.element.lastArea.contains(point)) return false

      let indexOf = remaining.indexOf(subscriber.element)
      if (indexOf >= 0) {
        remaining.splice(indexOf, 1)
        return false
      }

      this.elementMouseIn.push(subscriber.element)
      return true
    })
  }

  private handleMouseLeave(remaining: UIElement[]) {

    this.subscribers.publishWhen(EventType.MouseLeave, new MouseLeave(), subscriber => {

      if (subscriber.element == nothing) return false
      if (remaining.indexOf(subscriber.element) < 0) return false

      const index = this.elementMouseIn.indexOf(subscriber.element)
      if (index < 0) return false

      this.elementMouseIn.splice(index, 1)
      return true
    })
  }
}
