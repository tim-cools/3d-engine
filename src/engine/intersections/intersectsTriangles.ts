import {Segment, Triangle} from "../models"
import {IntersectionType} from "./intersectionResult"
import {intersectionTriangleSegment} from "./intersectionTriangleSegment"
import {intersectionTrianglePlane} from "./intersectionTrianglePlane"

export function intersectsTriangles(triangle1: Triangle, triangle2: Triangle): boolean {

  if (triangle1.isCoplanarTo(triangle2)) {

    if (triangle1.point1.belongsTo(triangle2)) return true;
    if (triangle1.point2.belongsTo(triangle2)) return true;
    if (triangle1.point3.belongsTo(triangle2)) return true;

    if (triangle2.point1.belongsTo(triangle1)) return true;
    if (triangle2.point2.belongsTo(triangle1)) return true;
    if (triangle2.point3.belongsTo(triangle1)) return true;

    const segment1Intersection = intersectionTriangleSegment(triangle1, new Segment(triangle2.point1, triangle2.point2))
    if (segment1Intersection.type != IntersectionType.None) return true

    const segment2Intersection = intersectionTriangleSegment(triangle1, new Segment(triangle2.point2, triangle2.point3))
    if (segment2Intersection.type != IntersectionType.None) return true

    const segment3Intersection = intersectionTriangleSegment(triangle1, new Segment(triangle2.point3, triangle2.point1))
    if (segment3Intersection.type != IntersectionType.None) return true
  }

  const intersection = intersectionTrianglePlane(triangle1, triangle2.plane());
  if (intersection.type == IntersectionType.Plane) {

    if (triangle1.point1.belongsTo(triangle2)) return true;
    if (triangle1.point2.belongsTo(triangle2)) return true;
    if (triangle1.point3.belongsTo(triangle2)) return true;

    if (triangle2.point1.belongsTo(triangle1)) return true;
    if (triangle2.point2.belongsTo(triangle1)) return true;
    if (triangle2.point3.belongsTo(triangle1)) return true;

    const segment1Intersection = intersectionTriangleSegment(triangle1, new Segment(triangle2.point1, triangle2.point2))
    if (segment1Intersection.type != IntersectionType.None) return true

    const segment2Intersection = intersectionTriangleSegment(triangle1, new Segment(triangle2.point2, triangle2.point3))
    if (segment2Intersection.type != IntersectionType.None) return true

    const segment3Intersection = intersectionTriangleSegment(triangle1, new Segment(triangle2.point3, triangle2.point1))
    if (segment3Intersection.type != IntersectionType.None) return true

  } else if (intersection.type == IntersectionType.Point) {
    return intersection.point.belongsTo(triangle2)
  } else if (intersection.type == IntersectionType.Segment) {
    return intersectionTriangleSegment(triangle2, intersection.segment).type != IntersectionType.None;
  }
  return false;
}
