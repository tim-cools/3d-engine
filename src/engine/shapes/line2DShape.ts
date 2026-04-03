import {Point2D, Primitive, PrimitiveSource} from "../models"
import {RenderShape2DContext, Shape2D} from "./shape2D"

export class Line2DShape implements Shape2D {

  readonly color: string
  readonly begin: Point2D
  readonly end: Point2D
  readonly z: number = 0

  constructor(color: string, begin: Point2D, end: Point2D) {
    this.color = color
    this.begin = begin
    this.end = end
  }

  static new(color: string, xBegin: number, yBegin: number, xEnd: number, yEnd: number) {
    const begin = new Point2D(xBegin, yBegin)
    const end = new Point2D(xEnd, yEnd)
    return new Line2DShape(color, begin, end)
  }

  render(context: RenderShape2DContext) {

    const {space, canvas} = context
    const begin = space.translate(this.begin)
    const end = space.translate(this.end)

    canvas.strokeStyle = this.color
    canvas.lineWidth = 4
    canvas.beginPath()
    canvas.moveTo(begin.x, begin.y)
    canvas.lineTo(end.x, end.y)
    canvas.stroke()
  }
}
