import {equalsTolerance} from "./equals";
import {FiniteObject, Plane, Point, Segment, Vector} from "./basics";

export class Triangle implements FiniteObject {

  readonly point1: Point
  readonly point2: Point
  readonly point3: Point

  constructor(point1: Point, point2: Point, point3: Point) {
    this.point1 = point1
    this.point2 = point2
    this.point3 = point3
  }

  normal() {
    return Vector.fromPoints(this.point1, this.point2)
      .cross(Vector.fromPoints(this.point1, this.point3))
      .normalize();
  }

  plane() {
    return new Plane(this.point1, this.normal());
  }

  pointLocation(point: Point): number {
    const projection = point.projectionToPlane(this.plane());
    if (equalsTolerance(point.distanceToPoint(projection), 0)) {
      return this.inPlanePointLocation(projection);
    } else {
      return -1; // Point is outside
    }
  }

  private area() {
    const vector1 = Vector.fromPoints(this.point1, this.point2);
    const vector2 = Vector.fromPoints(this.point1, this.point3);
    return 0.5 * vector1.cross(vector2).norm();
  }

  private inPlanePointLocation(point: Point) {

    if (point.belongsTo(new Segment(this.point1, this.point2))
     || point.belongsTo(new Segment(this.point1, this.point3))
     || point.belongsTo(new Segment(this.point3, this.point2))) {
      return 0; // Point is on boundary
    }

    const area = this.area();
    const alpha = Vector.fromPoints(point, this.point2)
      .cross(Vector.fromPoints(point, this.point3)).norm() / (2 * area);
    const beta = Vector.fromPoints(point, this.point3)
      .cross(Vector.fromPoints(point, this.point1)).norm() / (2 * area);
    const gamma = Vector.fromPoints(point, this.point1)
      .cross(Vector.fromPoints(point, this.point2)).norm() / (2 * area);

    if (equalsTolerance(((alpha + beta + gamma) - 1.0) * (this.ab() + this.bc() + this.ac()) / 3, 0.0)) {
      return 1; // Point is strictly inside
    } else {
      return -1;
    }
  }

  ab() {
    return this.point1.distanceToPoint(this.point2);
  }

  bc() {
    return this.point2.distanceToPoint(this.point3);
  }

  ac() {
    return this.point1.distanceToPoint(this.point3)
  }

  toString() {
    return `triangle (${this.point1} - ${this.point2} - ${this.point3})`
  }
}
