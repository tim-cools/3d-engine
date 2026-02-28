import {Shape} from "."
import {
  TransformablePoint,
  Transformer,
  Boundaries,
  Space, Point
} from "../models"
import {View2D} from ".."

export class PathShape implements Shape {

  readonly color: string
  readonly points: readonly TransformablePoint[]
  readonly id: string

  constructor(id: string, color: string, points: readonly Point[]) {
    this.id = id
    this.color = color
    this.points = points.map(point => new TransformablePoint(point))
  }

  public boundaries(space: Space): Boundaries {
    const points = this.transform(space)
    return Boundaries.fromArray(points)
  }

  public render(space: Space, view: View2D, context: CanvasRenderingContext2D) {
    //console.log(`drawLine: (${this.point1.x}, ${this.point1.y}, ${this.point1.z}) (${this.end.x}, ${this.end.y}, ${this.end.z})`)
    const points = this.transform(space)
    const pointsView = view.translateMany(points)
    //console.log(`drawLine: ${point1.x}, ${point1.y}, ${end.x}, ${end.y}`)
    context.fillStyle = this.color
    context.lineWidth = 3
    context.beginPath()
    context.moveTo(pointsView[pointsView.length - 1].x, pointsView[pointsView.length - 1].y)
    for (let index = 0  index < pointsView.length  index ++) {
      context.lineTo(pointsView[index].x, pointsView[index].y)
    }
    context.fill()
  }

  public update(transformers: readonly Transformer[]) {
    for (const point of this.points) {
      point.transform(transformers)
    }
  }

  private transform(space: Space) {
    return this.points.map(value => space.translate(value))
  }
}
