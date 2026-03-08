//adaption from GeometRi by Sergey Tarasov

import {Line, Segment, Triangle, Vector} from "../models"
import {
  Intersection,
  NoIntersection,
  noIntersection,
  PointIntersection,
  SegmentIntersection
} from "./intersectionResult"
import {tolerance} from "../models/equals"

export function coplanarIntersectionWith(triangle: Triangle, line: Line): PointIntersection | SegmentIntersection | NoIntersection {

  // Check intersection with first two sides
  const abSegment = new Segment(triangle.point1, triangle.point2)
  const bcSegment = new Segment(triangle.point2, triangle.point3)

  const onAB = line.perpendicularTo(abSegment.line())
  const onBC = line.perpendicularTo(bcSegment.line())

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
      return {type: Intersection.Segment, segment: new Segment(onAB, onBC), sourceSegments: [abSegment, bcSegment]}
    }
  }

  const ac = triangle.ac()

  //Check intersection with third side
  const acSegment = new Segment(triangle.point1, triangle.point3)
  const onAC = line.perpendicularTo(acSegment.line())

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
      return {type: Intersection.Segment, segment: new Segment(onAB, onAC), sourceSegments: [abSegment, acSegment]}
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
      return {type: Intersection.Segment, segment: new Segment(onBC, onAC), sourceSegments: [bcSegment, acSegment]}
    }
  }

  return noIntersection
}
