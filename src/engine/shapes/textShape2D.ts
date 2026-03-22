import {RenderShape2DContext, Shape2D} from "./shape"
import {Point2D} from "../models"

export class TextShape2D implements Shape2D {

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

  render(context: RenderShape2DContext) {

    const {space, canvas} = context

    canvas.fillStyle = this.color
    canvas.font = this.fontSize + "px sans-serif"

    const point2D = space.translate(this.position)
    canvas.fillText(this.text, point2D.x, point2D.y)
  }
}
