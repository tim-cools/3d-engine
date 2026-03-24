import {Point2D} from "../models"
import {TextShape2D} from "../shapes"
import {Object2DBase} from "./object2D"

export class Title extends Object2DBase {

  private readonly color: string
  private readonly position: Point2D
  private readonly fontSize: number
  private readonly text: string

  constructor(id: string, color: string, position: Point2D, fontSize: number, text: string) {
    super(id)

    this.color = color
    this.position = position
    this.fontSize = fontSize
    this.text = text

    const textShape = new TextShape2D(
      this.id + ".text",
      this.color,
      this.position,
      this.fontSize,
      this.text)

    this.setShapes([textShape])
  }
}

