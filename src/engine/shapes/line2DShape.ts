import {Point2D} from "../models"
import {RenderShape2DContext, Shape2D} from "./shape"
import {SelectableSegment} from "./selectableSegment"

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

    context.rendered(new SelectableSegment(this.id + ".selectable", begin, end))
  }
}
