//adaption from GeometRi by Sergey Tarasov
import {Plane, Triangle} from "../models"
import {
  IntersectionType,
  NoIntersection,
  noIntersection, PlaneIntersection,
  PointIntersection,
  SegmentIntersection,
  TriangleIntersection
} from "./intersectionResult"
import {coplanarIntersectionWith} from "./coplanarIntersectionWith"
import {intersectionPlanes} from "./intersectionPlanes"

export function intersectionTrianglePlane(triangle: Triangle, plane: Plane): PlaneIntersection | TriangleIntersection | PointIntersection | SegmentIntersection | NoIntersection {

  const st = new Plane(triangle.point1, triangle.direction());

  if (plane.isParallelTo(st)) {
    if (triangle.point1.belongsToPlane(plane)) {
      return new TriangleIntersection(triangle)
    } else {
      return noIntersection
    }
  }

  const l = intersectionPlanes(plane, st);
  if (l.type == IntersectionType.None) {
    return noIntersection
  }
  if (l.type == IntersectionType.Plane) {
    return l
  }

  // Line "l" is coplanar with triangle by construction
  return coplanarIntersectionWith(triangle, l.line);
}
