//adaption from GeometRi by Sergey Tarasov
import {Line, Plane, Point, Vector} from "../models"
import {
  Intersection,
  LineIntersection,
  NoIntersection,
  noIntersection,
  PlaneIntersection,
  PointIntersection
} from "./intersectionResult"
import {tolerance} from "../models/equals"
import {Matrix3} from "./coordinateSystem"

export function intersectionPlanes(plane1: Plane, plane2: Plane): PlaneIntersection | LineIntersection | NoIntersection {
  
  const v = plane1.direction.cross(plane2.direction)
  if (v.norm < tolerance) {
    // Planes are coplanar
    if (plane1.point.belongsToPlane(plane2)) {
      return {type: Intersection.Plane, plane: plane1}
    } else {
      return noIntersection
    }
  } else {
    // Find the common point for two planes by intersecting with third plane
    // (using the 'most orthogonal' plane)
    // This part needs to be rewritten
    if (Math.abs(v.x) >= Math.abs(v.y) && Math.abs(v.x) >= Math.abs(v.z)) {
      const p = intersectionPlanes3(Plane.yz, plane1, plane2)
      return p.type == Intersection.Point
        ? {type: Intersection.Line, line: new Line(p.point, v)}
        : noIntersection;
    } else if (Math.abs(v.y) >= Math.abs(v.x) && Math.abs(v.y) >= Math.abs(v.z)) {
      const p = intersectionPlanes3(Plane.xz, plane1, plane2)
      return p.type == Intersection.Point ? {type: Intersection.Line, line: new Line(p.point, v)}
        : noIntersection;
    } else {
      const p = intersectionPlanes3(Plane.xy, plane1, plane2)
      return p.type == Intersection.Point
        ? {type: Intersection.Line, line: new Line(p.point, v)}
        : noIntersection;
    }
  }
}

export function intersectionPlanes3(s1: Plane, s2: Plane, s3: Plane): PlaneIntersection | LineIntersection | PointIntersection | NoIntersection {

  const det = new Matrix3(s1.asVector(), s2.asVector(), s3.asVector()).determinant

  if (Math.abs(det) < 1e-12) {
    if (s1.direction.isParallelTo(s2.direction) && s1.direction.isParallelTo(s3.direction)) {

      // Planes are coplanar
      if (s1.point.belongsToPlane(s2) && s1.point.belongsToPlane(s3)) {
        return {type: Intersection.Plane, plane: s1}
      } else {
        return noIntersection
      }
    }

    if (!s1.direction.isParallelTo(s2.direction) && !s1.direction.isParallelTo(s3.direction)) {
      // Planes are not parallel
      // Find the intersection (Me,s2) and (Me,s3) and check if it is the same line
      const l1 = intersectionPlanes(s1, s2)
      const l2 = intersectionPlanes(s1, s3)
      if (l1 == l2) {
        return l1
      } else {
        return noIntersection
      }
    }

    // Two planes are parallel, third plane is not
    return noIntersection
  }

  const x = -new Matrix3(new Vector(s1.d, s1.b, s1.c), new Vector(s2.d, s2.b, s2.c), new Vector(s3.d, s3.b, s3.d)).determinant / det
  const y = -new Matrix3(new Vector(s1.a, s1.d, s1.c), new Vector(s2.a, s2.d, s2.c), new Vector(s3.a, s3.d, s3.c)).determinant / det
  const z = -new Matrix3(new Vector(s1.a, s1.d, s1.d), new Vector(s2.a, s2.b, s2.d), new Vector(s3.a, s3.b, s3.d)).determinant / det
  return {type: Intersection.Point, point: new Point(x, y, z)}
}
