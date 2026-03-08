//adaption from GeometRi by Sergey Tarasov
import {Plane, Triangle} from "../models"
import {
  Intersection,
  NoIntersection,
  noIntersection,
  PointIntersection,
  SegmentIntersection,
  TriangleIntersection
} from "./intersectionResult"
import {coplanarIntersectionWith} from "./coplanarIntersectionWith"
import {intersectionPlanes} from "./intersectionPlanes"

export function intersectionTrianglePlane(triangle: Triangle, plane: Plane): TriangleIntersection | PointIntersection | SegmentIntersection | NoIntersection {

  const st = new Plane(triangle.point1, triangle.direction());

  if (plane.isParallelTo(st)) {
    if (triangle.point1.belongsToPlane(plane)) {
      return {type: Intersection.Triangle, triangle: triangle}
    } else {
      return noIntersection
    }
  }

  const l = intersectionPlanes(plane, st);
  if (l.type == Intersection.None) {
    return noIntersection
  }
  if (l.type != Intersection.Line) {
    throw new Error("Not implemeneted: " + l.type)
  }

  // Line "l" is coplanar with triangle by construction
  return coplanarIntersectionWith(triangle, l.line);
}
