import {TransformablePoint, Boundaries, Space, Point, PrimitiveSource} from "../models"
import {RenderShapeContext} from "."
import {SelectablePoint} from "./selectablePoint"
import {nothing, Nothing} from "../../infrastructure/nothing"

export class PointShape {

  private readonly source: PrimitiveSource | Nothing

  readonly color: string
  readonly size: number
  readonly position: TransformablePoint

  constructor(color: string, position: Point, size: number, source: PrimitiveSource | Nothing = nothing) {
    this.source = source
    this.color = color
    this.size = size
    this.position = new TransformablePoint(position)
  }

  boundaries(space: Space): Boundaries {
    return Boundaries.fromItems(space.translate(this.position))
  }

  render(context: RenderShapeContext) {

    const {space, view, canvas} = context
    const coordinate = space.translate(this.position)
    const coordinate2D = view.translate(coordinate)
    const radius = this.size
    const halfSize = radius / 2

    canvas.strokeStyle = this.color
    canvas.lineWidth = 2
    canvas.beginPath()
    canvas.ellipse(coordinate2D.x - halfSize, coordinate2D.y - halfSize, radius, radius, 0, 0, 360)
    canvas.stroke()

    if (this.source != nothing) {
      context.rendered(new SelectablePoint(this.source, coordinate2D, this.size))
    }
  }
}
