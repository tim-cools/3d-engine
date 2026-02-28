import {Point2D, Space2D} from "../models"
import {View2D} from "../view"
import {Shape2D} from "./shape"

export class Line2DShape implements Shape2D {

  readonly color: string
  readonly begin: Point2D
  readonly end: Point2D
  readonly id: string

  constructor(id: string, color: string, begin: Point2D, end: Point2D) {
    this.id = id
    this.color = color
    this.begin = begin
    this.end = end
  }

  static new(id: string, color: string, xBegin: number, yBegin: number, xEnd: number, yEnd: number) {
    const begin = new Point2D(xBegin, yBegin)
    const end = new Point2D(xEnd, yEnd)
    return new Line2DShape(id, color, begin, end)
  }

  render(space: Space2D, view: View2D, context: CanvasRenderingContext2D) {
    //console.log(`drawLine: ${this.point1.x}, ${this.point1.y}, ${this.end.x}, ${this.end.y}`)

    const begin = space.translate(this.begin)
    const end = space.translate(this.end)
    context.strokeStyle = this.color
    context.lineWidth = 20
    context.beginPath()
    context.moveTo(begin.x, begin.y)
    context.lineTo(end.x, end.y)
    context.stroke()
  }
}
