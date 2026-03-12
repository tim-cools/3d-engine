//adaption from GeometRi by Sergey Tarasov
import {Line, Plane, Segment, Triangle} from "../models"
import {
  IntersectionType,
  LineIntersection,
  NoIntersection,
  noIntersection,
  PointIntersection,
  SegmentIntersection
} from "./intersectionResult"
import {intersectionSegments} from "./intersectionSegments"
import {coplanarIntersectionWith} from "./coplanarIntersectionWith"

export function intersectionTriangleSegment(triangle: Triangle, lineSegment: Segment): PointIntersection | SegmentIntersection | NoIntersection {

  const intersection = intersectionTriangleLine(triangle, lineSegment.line())
  if (intersection.type == IntersectionType.Point) {
    return intersection.point.belongsTo(lineSegment)
      ? intersection
      : noIntersection
  } else if (intersection.type == IntersectionType.Segment) {
    return intersectionSegments(lineSegment, intersection.segment, intersection.sourceSegments)
  }
  return noIntersection
}

function intersectionTriangleLine(triangle: Triangle, line: Line): PointIntersection | SegmentIntersection | NoIntersection {

  const plane = new Plane(triangle.point1, triangle.direction())

  const intersection = intersectionPlaneLine(plane, line)
  if (intersection.type == IntersectionType.Line) {
    return coplanarIntersectionWith(triangle, line)
  }
  if (intersection.type == IntersectionType.Point) {
    return intersection.point.belongsTo(triangle)
      ? intersection
      : noIntersection
  }
  return noIntersection
}

function intersectionPlaneLine(plane: Plane, line: Line): PointIntersection | LineIntersection | NoIntersection {

  const s1 = line.direction
  const n2 = plane.direction
  if (s1.isOrthogonalTo(n2)) {
    // Line and plane are parallel
    if (line.point.belongsToPlane(plane)) {
      // Line lies in the plane
      return new LineIntersection(line)
    } else {
      return noIntersection
    }
  } else {
    // IntersectionType point
    const d = (plane.point.subtract(line.point)).dot(plane.direction) / (plane.direction.dot(line.direction))
    return new PointIntersection(line.point.translate(line.direction.multiplyNumber(d)))
  }
}

