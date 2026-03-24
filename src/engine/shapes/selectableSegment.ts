import {FrontShape2D, RenderShape2DContext, Shape2D} from "./shape"
import {Point2D, Segment2D} from "../models"
import {Colors} from "../colors"
import {Selectable, SelectableMargin} from "./selectable"

export class SelectableSegment implements Shape2D, Selectable {

  private readonly segment: Segment2D
  private readonly margin: number

  readonly id: string
  readonly z: number = FrontShape2D

  constructor(id: string, begin: Point2D, end: Point2D, margin: number = SelectableMargin) {
    this.id = id
    this.margin = margin
    this.segment = new Segment2D(begin, end)
  }

  includes(point: Point2D): Boolean {
    return this.segment.includes(point, this.margin)
  }

  render(context: RenderShape2DContext) {

    const {canvas} = context

    canvas.strokeStyle = Colors.highlight
    canvas.lineWidth = 5
    canvas.beginPath()
    canvas.moveTo(this.segment.begin.x, this.segment.begin.y)
    canvas.lineTo(this.segment.end.x, this.segment.end.y)
    canvas.stroke()
  }
}
