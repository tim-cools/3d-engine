import {Model} from "./model"
import {ModelType, Point, Segment} from "./primitives"
import {any} from "../../infrastructure"
import {Triangle} from "./face"

export class TriangleModel extends Model {

  private constructor(segments: readonly Segment[], triangles: Triangle[]) {
    super(segments, triangles, TriangleModel.contains(triangles), TriangleModel.onBoundary(segments))
  }

  static create(point1: Point, point2: Point, point3: Point, type: ModelType = ModelType.Primary): TriangleModel {

    const segments = [
      new Segment(point1, point2, type),
      new Segment(point2, point3, type),
      new Segment(point3, point1, type),
    ]
    const triangle = new Triangle(point1, point2, point3, type)

    return new TriangleModel(segments, [triangle])
  }

  static createMultiple(triangles: Triangle[]) {

    const segments: Segment[] = []
    for (const trianglePoints of triangles) {
      this.addSegment(segments, new Segment(trianglePoints.point1, trianglePoints.point2, trianglePoints.type))
      this.addSegment(segments, new Segment(trianglePoints.point2, trianglePoints.point3, trianglePoints.type))
      this.addSegment(segments, new Segment(trianglePoints.point3, trianglePoints.point1, trianglePoints.type))
    }

    return new TriangleModel(segments, triangles)
  }

  private static addSegment(segments: Segment[], newSegment: Segment) {
    const existing = any(segments, segment => segment.equals(newSegment))
    if (!existing) {
      segments.push(newSegment)
    }
  }

  private static contains(triangles: Triangle[]) {
    return (point: Point) => any(triangles, triangle => triangle.pointLocation(point) >= 0)
  }

  private static onBoundary(segments: readonly Segment[]) {
    return (point: Point) => any(segments, segment => segment.pointLocation(point) >= 0)
  }
}
