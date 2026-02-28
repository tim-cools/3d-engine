import {View, View2D} from ".."
import {TransformablePoint, Boundaries, Space} from "../models"
import {Shape} from "."

export class PointShape implements Shape {

  readonly id: string
  readonly color: string
  readonly size: number
  readonly position: TransformablePoint

  constructor(id: string, color: string, x: number, y: number, z: number, size: number) {
    this.id = id
    this.color = color
    this.size = size
    this.position = TransformablePoint.new(x, y, z)
  }

  public boundaries(space: Space): Boundaries {
    return Boundaries.fromItems(space.translate(this.position))
  }

  public render(space: Space, view: View2D, context: CanvasRenderingContext2D) {
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
