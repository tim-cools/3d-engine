import {FrontShape2D, RenderShape2DContext, Shape2D} from "./shape"
import {Path, PathSegment, Point2D, Segment2D, Triangle} from "../models"
import {Colors} from "../../infrastructure/colors"
import {Selectable, SelectableMargin} from "./selectable"
import {any} from "../../infrastructure"

export class SelectablePath implements Shape2D, Selectable {

  private readonly points: readonly Point2D[]
  private readonly solid: boolean
  private readonly triangles: readonly Triangle[]
  private readonly segments: readonly Segment2D[]

  readonly id: string
  readonly z: number = FrontShape2D

  constructor(id: string, points: readonly Point2D[], solid: boolean) {
    this.id = id
    this.points = points
    this.solid = solid

    const {triangles, segments} = SelectablePath.createTriangles(points)
    this.triangles = triangles
    this.segments = segments
  }

  includes(point: Point2D): boolean {
    if (!point) return false
    if (this.solid) {
      const point3D = point.to3D()
      return any(this.triangles, triangle => triangle.pointLocation(point3D) >= 0)
    } else {
      return any(this.segments, segment => segment.includes(point, SelectableMargin))
    }
  }

  render(context: RenderShape2DContext) {

    const {canvas} = context

    canvas.strokeStyle = Colors.highlight
    canvas.lineWidth = 3
    canvas.beginPath()
    canvas.moveTo(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y)
    for (let index = 0; index < this.points.length; index++) {
      canvas.lineTo(this.points[index].x, this.points[index].y)
    }
    canvas.stroke()
  }

  private static createTriangles(points: readonly Point2D[]): {triangles: readonly Triangle[], segments: readonly Segment2D[]} {

    const segments: PathSegment[] = []
    const segments2D: Segment2D[] = []

    function addSegment(begin: Point2D, end: Point2D) {
      segments.push(new PathSegment(begin.to3D(), end.to3D()))
      segments2D.push(new Segment2D(begin, end))
    }

    for (let index = 0; index < points.length - 1; index++){
      addSegment(points[index], points[index + 1])
    }
    addSegment(points[points.length - 1], points[0])

    const path = new Path(segments)      //todo create a 2D path object
    return {triangles: path.triangles, segments: segments2D}
  }
}
