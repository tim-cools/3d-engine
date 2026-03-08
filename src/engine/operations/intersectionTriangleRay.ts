//adaption from GeometRi by Sergey Tarasov
import {Plane, Point, Ray, Segment, Triangle, Vector} from "../models"
import {tolerance} from "../models/equals"
import {
  Intersection,
  NoIntersection,
  noIntersection,
  PointIntersection,
  SegmentIntersection
} from "./intersectionResult"
import {intersectionSegmentLine} from "./intersectionSegments"

export function intersectionTriangleRay(triangle: Triangle, ray: Ray): PointIntersection | SegmentIntersection | NoIntersection {

  /// acc. to https://en.wikipedia.org/wiki/M%C3%B6ller%E2%80%93Trumbore_intersection_algorithm

  const vertex0: Point = triangle.point1;
  const vertex1: Point = triangle.point2;
  const vertex2: Point = triangle.point3;

  const edge1: Vector = Vector.fromPoints(vertex0, vertex1);
  const edge2: Vector = Vector.fromPoints(vertex0, vertex2);
  const h: Vector = ray.direction.cross(edge2);
  const a = edge1.dot(h);

  if (a > -tolerance && a < tolerance) {

    // The ray is parallel to the triangle
    // Check if the ray is in the plane of the triangle
    const plane: Plane = triangle.plane();
    if (Math.abs(plane.direction.dot(ray.direction)) < tolerance && ray.point.belongsToPlane(plane)) {
      
      // Ray in the plane of the triangle: intersection = segment (portion of the ray inside the triangle)
      // We look for the intersections of the ray with the 3 edges of the triangle
      const intersections: Point[] = [];
      const edges: Segment[] = [
        new Segment(vertex0, vertex1),
        new Segment(vertex1, vertex2),
        new Segment(vertex2, vertex0)
      ]

      for (let edge of edges) {
        const inter = intersectionRaySegment(ray, edge)
        if (inter.type == Intersection.Point && intersections.length < 2) {
          // Check that the point is actually inside the triangle
          if (inter.point.belongsToRay(ray)) {
            intersections.push(inter.point);
          }
        }
      }

      if (intersections.length == 2) {
        if (intersections[0] == intersections[1]) {
          return {type: Intersection.Point, point: intersections[0]}
        }
        return {type: Intersection.Segment, segment: new Segment(intersections[0], intersections[1]), sourceSegments: []};
      } else if (intersections.length == 1) {
        if (intersections[0] == ray.point) {
          return {type: Intersection.Point, point: intersections[0]}
        }else {
          return {type: Intersection.Segment, segment: new Segment(ray.point, intersections[0]), sourceSegments: []};
        }
      } else {
        return noIntersection;
      }
    } else {
      return noIntersection;
    }
  }

  const f = 1.0 / a;
  const s = Vector.fromPoints(vertex0, ray.point);
  const u = f * s.dot(h);
  if (u < 0.0 - tolerance || u > 1.0 + tolerance) {
    return noIntersection;
  }

  const q = s.cross(edge1);
  const v = f * ray.direction.dot(q);
  if (v < 0.0 && Math.abs(v) > tolerance || u + v > 1.0 && Math.abs(u + v - 1) > tolerance) {
    return noIntersection;
  }

  const t = f * edge2.dot(q);
  if (t > tolerance) {
    // intersectionPoint = rayOrigin + t * rayVector
    const intersectionPoint = ray.point.add(ray.direction.multiplyNumber(t));
    return {type: Intersection.Point, point: intersectionPoint}
  } else {
    return noIntersection;
  }
}

function intersectionRaySegment(ray: Ray, segment: Segment): PointIntersection | SegmentIntersection | NoIntersection {

  const intersection = intersectionSegmentLine(segment, ray.line());

  if (intersection.type == Intersection.None) {
    return noIntersection;
  } else if (intersection.type == Intersection.Point) {
    if (intersection.point.belongsToRay(ray)) {
      return intersection;
    }
    return noIntersection;
  }

  const intersectionSegment = intersection.segment
  if (intersectionSegment.begin.belongsToRay(ray) && intersectionSegment.end.belongsToRay(ray)) {
    return intersection;
  } else if (intersectionSegment.begin.belongsToRay(ray)) {
    if (intersectionSegment.begin.equals(ray.point)) {
      return {type: Intersection.Point, point: ray.point};
    } else {
      return {type: Intersection.Point, point: intersectionSegment.begin};
    }
  } else if (intersectionSegment.end.belongsToRay(ray)) {
    if (intersectionSegment.end.equals(ray.point)) {
      return {type: Intersection.Point, point: ray.point};
    } else {
      return {type: Intersection.Point, point: intersectionSegment.end};
    }
  }

  return noIntersection;
}
