import {Shape2D} from "./shape"
import {Point2D, Space2D} from "../models"
import {View2D} from "../view"

export class Text2DShape implements Shape2D {

  readonly id: string
  readonly color: string
  readonly position: Point2D
  readonly fontSize: number
  readonly text: string

  constructor(id: string, color: string, position: Point2D, fontSize: number, text: string) {
    this.id = id
    this.color = color
    this.position = position
    this.fontSize = fontSize
    this.text = text
  }

  render(space: Space2D, view: View2D, context: CanvasRenderingContext2D) {
    context.fillStyle = this.color
    context.font = this.fontSize + "px sans-serif"

    const point2D = space.translate(this.position)
    context.fillText(this.text, point2D.x, point2D.y)
  }
}
