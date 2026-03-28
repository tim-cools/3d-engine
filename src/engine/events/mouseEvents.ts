import {EventType} from "./eventType"
import {Point2D} from "../models"

export class MouseEnter {
  readonly eventType = EventType.MouseEnter
}

export class MouseLeave {
  readonly eventType = EventType.MouseLeave
}

export class MouseOver {

  readonly eventType = EventType.MouseOver

  constructor(public point: Point2D = Point2D.default, public mouseIsDown: boolean = false) {
  }
}

export class MouseDown {
  readonly eventType = EventType.MouseDown
}
