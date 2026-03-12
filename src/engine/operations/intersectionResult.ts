//adaption from GeometRi by Sergey Tarasov
import {Line, Segment, Plane, Triangle} from "../models"
import {Point} from "../models"

export enum IntersectionType {
  None,
  Point,
  Line,
  Segment,
  Triangle,
  Plane
}

export type Intersection = NoIntersection | PointIntersection | SegmentIntersection | LineIntersection | PlaneIntersection | TriangleIntersection

export class NoIntersection {

  readonly type = IntersectionType.None

  equals(value: Intersection) {
    return value.type == IntersectionType.None
  }
}

export const noIntersection = new NoIntersection()

export class PointIntersection {

  readonly type = IntersectionType.Point
  readonly point: Point

  constructor(point: Point) {
    this.point = point
  }

  equals(value: Intersection) {
    return value.type == IntersectionType.Point && value.point.equals(this.point)
  }
}

export class LineIntersection {

  readonly type = IntersectionType.Line
  readonly line: Line

  constructor(line: Line) {
    this.line = line
  }

  equals(value: Intersection) {
    return value.type == IntersectionType.Line && value.line.equals(this.line)
  }
}

export class SegmentIntersection {

  readonly type = IntersectionType.Segment
  readonly segment: Segment
  readonly sourceSegments: readonly Segment[]

  constructor(segment: Segment, sourceSegments: readonly Segment[]) {
    this.segment = segment
    this.sourceSegments = sourceSegments
  }

  equals(value: Intersection) {
    return value.type == IntersectionType.Segment && value.segment.equals(this.segment)
  }
}

export class TriangleIntersection {

  readonly type = IntersectionType.Triangle
  readonly triangle: Triangle

  constructor(triangle: Triangle) {
    this.triangle = triangle
  }

  equals(value: Intersection) {
    return value.type == IntersectionType.Triangle && value.triangle.equals(this.triangle)
  }
}

export class PlaneIntersection {

  readonly type = IntersectionType.Plane
  readonly plane: Plane

  constructor(plane: Plane) {
    this.plane = plane
  }

  equals(value: Intersection) {
    return value.type == IntersectionType.Plane && value.plane.equals(this.plane)
  }
}
