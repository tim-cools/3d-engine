import {Point2D} from "../models"
import {Shape2D, TextShape2D} from "../shapes"
import {BaseObject2D} from "./object"

export class Title extends BaseObject2D {

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
  }

  shapes(): readonly Shape2D[] {
    const text = new TextShape2D(
      this.id + ".text",
      this.color,
      this.position,
      this.fontSize,
      this.text)
    return [text]
  }

  update(timeMilliseconds: number): void {
  }
}

