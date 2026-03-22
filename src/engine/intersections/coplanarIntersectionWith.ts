//adaption from GeometRi by Sergey Tarasov
import {Line, Segment, Triangle, Vector} from "../models"
import {
  IntersectionType,
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
  const acSegment = new Segment(triangle.point1, triangle.point3)

  const onAB = line.perpendicularTo(abSegment.line)
  const onBC = line.perpendicularTo(bcSegment.line)
  const onAC = line.perpendicularTo(acSegment.line)

  const ab = triangle.abLength
  const bc = triangle.bcLength
  const ac = triangle.caLength

  if (onAB != null && onBC != null) {

    const positionOnAB = Vector.fromPoints(triangle.point1, onAB)
      .dot(Vector.fromPoints(triangle.point1, triangle.point2)) / (ab * ab)
    const positionOnBC = Vector.fromPoints(triangle.point2, onBC)
      .dot(Vector.fromPoints(triangle.point2, triangle.point3)) / (bc * bc)

    if (positionOnAB >= 1 - tolerance && positionOnAB <= 1 + tolerance
      && positionOnBC >= -tolerance && positionOnBC <= tolerance) {

      // Check intersection with AC
      // todo finish subtract faces algorithm
      const onAC = line.perpendicularTo(acSegment.line)
      if (onAC != null) {
        const positionOnAC = Vector.fromPoints(triangle.point1, onAC)
          .dot(Vector.fromPoints(triangle.point1, triangle.point3)) / (ac * ac)
        if (positionOnAC > -tolerance && positionOnAC <= 1 + tolerance) {
          return new SegmentIntersection(new Segment(triangle.point2, onAC), [abSegment, bcSegment, acSegment])
        }
      }

      return new PointIntersection(triangle.point2)
    }

    if (positionOnAB >= -tolerance && positionOnAB < 1 - tolerance
      && positionOnBC > tolerance && positionOnBC <= 1 + tolerance) {
      return new SegmentIntersection(new Segment(onAB, onBC), [abSegment, bcSegment])
    }
  }


  if (onAB != null && onAC != null) {

    const positionOnAB = Vector.fromPoints(triangle.point1, onAB)
      .dot(Vector.fromPoints(triangle.point1, triangle.point2)) / (ab * ab)
    const positionOnAC = Vector.fromPoints(triangle.point1, onAC)
      .dot(Vector.fromPoints(triangle.point1, triangle.point3)) / (ac * ac)

    if (positionOnAB >= -tolerance && positionOnAB <= tolerance
      && positionOnAC >= -tolerance && positionOnAC <= tolerance) {

      // Check intersection with AC
      // todo finish subtract faces algorithm
      const onBC = line.perpendicularTo(bcSegment.line)
      if (onBC != null) {
        const positionOnBC = Vector.fromPoints(triangle.point2, onBC)
          .dot(Vector.fromPoints(triangle.point2, triangle.point3)) / (ac * ac)
        if (positionOnBC > -tolerance && positionOnBC <= 1 + tolerance) {
          return new SegmentIntersection(new Segment(triangle.point1, onBC), [abSegment, acSegment, bcSegment])
        }
      }

      return new PointIntersection(triangle.point1)
    }

    if (positionOnAB > tolerance && positionOnAB <= 1 + tolerance
      && positionOnAC > tolerance && positionOnAC <= 1 + tolerance) {
      return new SegmentIntersection(new Segment(onAB, onAC), [abSegment, acSegment])
    }
  }

  if (onBC != null && onAC != null) {

    const positionOnBC = Vector.fromPoints(triangle.point2, onBC)
      .dot(Vector.fromPoints(triangle.point2, triangle.point3)) / (bc * bc)
    const positionOnAC = Vector.fromPoints(triangle.point1, onAC)
      .dot(Vector.fromPoints(triangle.point1, triangle.point3)) / (ac * ac)

    if (positionOnBC >= 1 - tolerance && positionOnBC <= 1 + tolerance
      && positionOnAC >= 1 - tolerance && positionOnAC <= 1 + tolerance) {

      // Check intersection with AB
      if (onAB != null) {
        const positionOnAB = Vector.fromPoints(triangle.point1, onAB)
          .dot(Vector.fromPoints(triangle.point1, triangle.point2)) / (ab * ab)
        if (positionOnAB > -tolerance && positionOnAB <= 1 + tolerance) {
          return new SegmentIntersection(new Segment(triangle.point3, onAB), [bcSegment, acSegment, abSegment])
        }
      }

      return new PointIntersection(triangle.point3)
    } else if (positionOnBC >= -tolerance && positionOnBC < 1 - tolerance
      && positionOnAC >= -tolerance && positionOnAC < 1 - tolerance) {
      return new SegmentIntersection(new Segment(onBC, onAC), [bcSegment, acSegment])
    }
  }

  return noIntersection
}
