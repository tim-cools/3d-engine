import {FrontShape2D, RenderShape2DContext, Shape2D} from "./shape2D"
import {Point2D, PrimitiveSource} from "../models"
import {Colors} from "../../infrastructure/colors"
import {Selectable, SelectableState} from "./selectable"

export class SelectablePoint implements Shape2D, Selectable {

  private readonly point: Point2D
  private readonly size: number
  private readonly radius: number

  readonly z: number = FrontShape2D
  readonly source: PrimitiveSource

  state: SelectableState = SelectableState.Hover

  constructor(source: PrimitiveSource, point: Point2D, size: number) {
    this.source = source
    this.point = point
    this.size = size
    this.radius = this.size / 2
  }

  includes(point: Point2D): Boolean {
    return point.x >= this.point.x - this.radius - 1 && point.x <= this.point.x + this.radius + 1
        && point.y >= this.point.y - this.radius - 1 && point.y <= this.point.y + this.radius + 1
  }

  render(context: RenderShape2DContext) {

    const {canvas} = context
    const radius = this.size
    const halfSize = radius / 2

    canvas.strokeStyle = this.color()
    canvas.lineWidth = 2
    canvas.beginPath()
    canvas.ellipse(this.point.x - halfSize, this.point.y - halfSize, radius, radius, 0, 0, 360)
    canvas.stroke()
  }

  private color() {
    if (this.state == SelectableState.Selected) {
      return Colors.highlightMax
    } else if (this.state == SelectableState.Group) {
      return Colors.highlightSecondary
    }
    return Colors.highlight
  }
}
