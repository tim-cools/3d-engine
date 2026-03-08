//adaption from GeometRi by Sergey Tarasov

import {Line, Plane, Segment, Triangle} from "../models"
import {
  Intersection,
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
  if (intersection.type == Intersection.Point) {
    return intersection.point.belongsTo(lineSegment)
      ? intersection
      : noIntersection
  } else if (intersection.type == Intersection.Segment) {
    return intersectionSegments(lineSegment, intersection.segment, intersection.sourceSegments)
  }
  return noIntersection
}

function intersectionTriangleLine(triangle: Triangle, line: Line): PointIntersection | SegmentIntersection | NoIntersection {

  const plane = new Plane(triangle.point1, triangle.direction())

  const intersection = intersectionPlaneLine(plane, line)
  if (intersection.type == Intersection.Line) {
    return coplanarIntersectionWith(triangle, line)
  }
  if (intersection.type == Intersection.Point) {
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
      return {type: Intersection.Line, line: line}
    } else {
      return noIntersection
    }
  } else {
    // Intersection point
    const d = (plane.point.subtract(line.point)).dot(plane.direction) / (plane.direction.dot(line.direction))
    return {type: Intersection.Point, point: line.point.translate(line.direction.multiplyNumber(d))}
  }
}

