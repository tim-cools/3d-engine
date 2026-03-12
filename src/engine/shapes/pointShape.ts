import {View, View2D} from ".."
import {TransformablePoint, Boundaries, Space, Point, Transformer} from "../models"
import {Shape, UpdatableShape} from "."

export class PointShape implements UpdatableShape {

  readonly id: string
  readonly color: string
  readonly size: number
  readonly position: TransformablePoint

  constructor(id: string, color: string, position: Point, size: number) {
    this.id = id
    this.color = color
    this.size = size
    this.position = new TransformablePoint(position)
  }

  update(transformers: readonly Transformer[]): void {
  }

  boundaries(space: Space): Boundaries {
    return Boundaries.fromItems(space.translate(this.position))
  }

  render(space: Space, view: View2D, context: CanvasRenderingContext2D) {
    //console.log(`point: 3D (${this.position.x}, ${this.position.y}, ${this.position.z})`)
    const coordinate = space.translate(this.position)
    const coordinate2D = view.translate(coordinate)
    const radius = this.size
    const halfSize = radius / 2
    //console.log(`     > 2D ${coordinate2D.x}, ${coordinate2D.y}`)
    context.strokeStyle = this.color
    context.lineWidth = 2
    context.beginPath()
    context.ellipse(coordinate2D.x - halfSize, coordinate2D.y - halfSize, radius, radius, 0, 0, 360)
    context.stroke()
  }
}
