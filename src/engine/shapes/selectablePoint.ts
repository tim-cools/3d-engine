import {FrontShape2D, RenderShape2DContext, Shape2D} from "./shape"
import {Point2D} from "../models"
import {Colors} from "../colors"
import {Selectable} from "./selectable"

export class SelectablePoint implements Shape2D, Selectable {

  private readonly point: Point2D
  private readonly size: number
  private readonly radius: number

  readonly id: string
  readonly z: number = FrontShape2D

  constructor(id: string, point: Point2D, size: number) {
    this.id = id
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

    canvas.strokeStyle = Colors.highlight
    canvas.lineWidth = 2
    canvas.beginPath()
    canvas.ellipse(this.point.x - halfSize, this.point.y - halfSize, radius, radius, 0, 0, 360)
    canvas.stroke()
  }
}
