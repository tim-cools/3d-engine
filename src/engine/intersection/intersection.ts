//adaption from GeometRi by Sergey Tarasov

import {Line, Segment, Plane, Triangle, Vector} from "../models"
import {equalsTolerance, greaterTolerance, smallerTolerance, tolerance} from "../models/equals"
import {Point} from "../models"

export enum Intersection {
  None,
  Point,
  Line,
  Segment
}

const NoIntersectionValue: NoIntersection = {
  type: Intersection.None
}

export type NoIntersection = {
  type: Intersection.None
}

export type PointIntersection = {
  type: Intersection.Point,
  point: Point
}

export type LineIntersection = {
  type: Intersection.Line,
  line: Line
}

export type LineSegmentIntersection = {
  type: Intersection.Segment,
  segment: Segment
}

export function intersectionTriangleLineSegment(triangle: Triangle, lineSegment: Segment): PointIntersection | LineSegmentIntersection | NoIntersection {

  const intersection = intersectionTriangleLine(triangle, lineSegment.line())
  if (intersection.type == Intersection.Point) {
    return intersection.point.belongsTo(lineSegment)
      ? intersection
      : NoIntersectionValue
  } else if (intersection.type == Intersection.Segment) {
    return intersectionLineSegment(lineSegment, intersection.segment)
  }
  return NoIntersectionValue
}

export function intersectionTriangleLine(triangle: Triangle, line: Line): PointIntersection | LineSegmentIntersection | NoIntersection {

  const plane = new Plane(triangle.point1, triangle.normal())

  const intersection = intersectionPlaneLine(plane, line)
  if (intersection.type == Intersection.Line) {
    return coplanarIntersectionWith(triangle, line)
  }
  if (intersection.type == Intersection.Point) {
    return intersection.point.belongsTo(triangle)
      ? intersection
      : NoIntersectionValue
  }
  return NoIntersectionValue
}

export function intersectionPlaneLine(plane: Plane, line: Line): PointIntersection | LineIntersection | NoIntersection {

  const s1 = line.direction
  const n2 = plane.normal
  if (s1.isOrthogonalTo(n2)) {
    // Line and plane are parallel
    if (line.point.belongsToPlane(plane)) {
      // Line lies in the plane
      return {type: Intersection.Line, line: line}
    } else {
      return NoIntersectionValue
    }
  } else {
    // Intersection point
    const d = (plane.point.subtract(line.point)).dot(plane.normal) / (plane.normal.dot(line.direction))
    return {type: Intersection.Point, point: line.point.translate(line.direction.multiplyNumber(d))}
  }
}
class Matrix3 {

  private values: number[][] = []

  constructor(row1: Vector, row2: Vector, row3: Vector) {
    this.values[0] = Matrix3.row(row1)
    this.values[1] = Matrix3.row(row2)
    this.values[2] = Matrix3.row(row3)
  }

  private static row(row1: Vector) {
    return [row1.x, row1.y, row1.z]
  }

  multiply(value: Point): Point {
    const x = this.values[0][0] * value.x + this.values[0][1] * value.y + this.values[0][2] * value.z
    const y = this.values[1][0] * value.x + this.values[1][1] * value.y + this.values[1][2] * value.z
    const z = this.values[2][0] * value.x + this.values[2][1] * value.y + this.values[2][2] * value.z
    return new Point(x, y, z)
  }

  transposeMultiply(value: Point): Point {
    const x = this.values[0][0] * value.x + this.values[1][0] * value.y + this.values[2][0] * value.z
    const y = this.values[0][1] * value.x + this.values[1][1] * value.y + this.values[2][1] * value.z
    const z = this.values[0][2] * value.x + this.values[1][2] * value.y + this.values[2][2] * value.z
    return new Point(x, y, z)
  }
}

class CoordinateSystem {

  private readonly origin: Point
  private readonly axes: Matrix3

  constructor(point: Point, xAxisVector: Vector, xyPlaneVector: Vector) {

    if (xAxisVector.isParallelTo(xyPlaneVector)) {
      throw new Error("Vectors are parallel")
    }

    xAxisVector = xAxisVector.normalize()
    const vector3 = xAxisVector.cross(xyPlaneVector).normalize()
    xyPlaneVector = vector3.cross(xAxisVector).normalize()

    this.origin = point
    this.axes = new Matrix3(xAxisVector, xyPlaneVector, vector3)
  }

  convert(point: Point): Point {
    let result = point.subtract(this.origin)
    return this.axes.multiply(result)
  }

  toGlobal(point: Point): Point {
    const result = this.axes.transposeMultiply(point)
    return result.add(this.origin)
  }
}

export function intersectionLineSegment(lineSegment1: Segment, lineSegment2: Segment): LineSegmentIntersection | PointIntersection | NoIntersection {

  if (lineSegment1.equals(lineSegment2)) {
    return {
      type: Intersection.Segment,
      segment: lineSegment1
    }
  }

  const line1 = lineSegment1.line()
  const line2 = lineSegment2.line()

  if (lineSegment1.belongsToLine(line2) || lineSegment2.belongsToLine(line1)) {
    
    // Segments are collinear

    // Create local CS with X-axis along segment 's'
    const v2 = lineSegment2.vector().orthogonalVector()
    const cs = new CoordinateSystem(lineSegment2.begin, lineSegment2.vector(), v2)
    const x1 = 0.0
    const x2 = lineSegment2.length()

    const t3 = cs.convert(lineSegment1.begin).x
    const t4 = cs.convert(lineSegment1.end).x
    const x3 = Math.min(t3, t4)
    const x4 = Math.max(t3, t4)

    // Segments do not overlap
    if (smallerTolerance(x4, x1) || greaterTolerance(x3, x2)) {
      return NoIntersectionValue
    }

    // One common point
    if (equalsTolerance(Math.max(x3, x4), x1)) {
      return {type: Intersection.Point, point: cs.toGlobal(new Point(x1, 0, 0))}
    }
    if (equalsTolerance(Math.min(x3, x4), x2)) {
      return {type: Intersection.Point, point: cs.toGlobal(new Point(x2, 0, 0))}
    }

    // Overlapping segments
    const overlapX1 = Math.max(x1, x3)
    const overlapX2 = Math.min(x2, x4)
    const overlapBegin = cs.toGlobal(new Point(overlapX1, 0, 0))
    const overlapEnd = cs.toGlobal(new Point(overlapX2, 0, 0))
    return {type: Intersection.Segment, segment: new Segment(overlapBegin, overlapEnd)}
  } else {
    const perpendicular = line1.perpendicularTo(line2)
    if (perpendicular != null && perpendicular.belongsTo(lineSegment1) && perpendicular.belongsTo(lineSegment2)) {
      return {type: Intersection.Point, point: perpendicular}
    } else {
      return NoIntersectionValue
    }
  }
}

function coplanarIntersectionWith(triangle: Triangle, line: Line): PointIntersection | LineSegmentIntersection | NoIntersection  {

  // Check intersection with first two sides
  const onAB = line.perpendicularTo(new Segment(triangle.point1, triangle.point2).line())
  const onBC = line.perpendicularTo(new Segment(triangle.point2, triangle.point3).line())

  const ab = triangle.ab()
  const bc = triangle.bc()

  if (onAB != null && onBC != null) {

    const positionOnAB = Vector.fromPoints(triangle.point1, onAB)
      .dot(Vector.fromPoints(triangle.point1, triangle.point2)) / (ab * ab)
    const positionOnBC = Vector.fromPoints(triangle.point2, onBC)
      .dot(Vector.fromPoints(triangle.point2, triangle.point3)) / (bc * bc)

    if (positionOnAB >= 1 - tolerance && positionOnAB <= 1 + tolerance
      && positionOnBC >= -tolerance && positionOnBC <= tolerance) {
      return {type: Intersection.Point, point: triangle.point2}
    }

    if (positionOnAB >= -tolerance && positionOnAB < 1 - tolerance
      && positionOnBC > tolerance && positionOnBC <= 1 + tolerance) {
      return {type: Intersection.Segment, segment: new Segment(onAB, onBC)}
    }
  }

  const ac = triangle.ac()

  //Check intersection with third side
  const onAC = line.perpendicularTo(new Segment(triangle.point1, triangle.point3).line())
  if (onAB != null && onAC != null) {

    const positionOnAB = Vector.fromPoints(triangle.point1, onAB)
      .dot(Vector.fromPoints(triangle.point1, triangle.point2)) / (ab * ab)
    const positionOnAC = Vector.fromPoints(triangle.point1, onAC)
      .dot(Vector.fromPoints(triangle.point1, triangle.point3)) / (ac * ac)

    if (positionOnAB >= -tolerance && positionOnAB <= tolerance
      && positionOnAC >= -tolerance && positionOnAC <= tolerance) {
      return {type: Intersection.Point, point: triangle.point1}
    }

    if (positionOnAB > tolerance && positionOnAB <= 1 + tolerance
      && positionOnAC > tolerance && positionOnAC <= 1 + tolerance) {
      return {type: Intersection.Segment, segment: new Segment(onAB, onAC)}
    }
  }

  if (onBC != null && onAC != null) {

    const positionOnBC = Vector.fromPoints(triangle.point2, onBC)
      .dot(Vector.fromPoints(triangle.point2, triangle.point3)) / (bc * bc)
    const positionOnAC = Vector.fromPoints(triangle.point1, onAC)
      .dot(Vector.fromPoints(triangle.point1, triangle.point3)) / (ac * ac)

    if (positionOnBC >= 1 - tolerance && positionOnBC <= 1 + tolerance
      && positionOnAC >= 1 - tolerance && positionOnAC <= 1 + tolerance) {
      return {type: Intersection.Point, point: triangle.point3}
    } else if (positionOnBC >= -tolerance && positionOnBC < 1 - tolerance
      && positionOnAC >= -tolerance && positionOnAC < 1 - tolerance) {
      return {type: Intersection.Segment, segment: new Segment(onBC, onAC)}
    }
  }

  return NoIntersectionValue
}
