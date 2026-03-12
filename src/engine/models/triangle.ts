import {equalsTolerance} from "./equals"
import {Finite, ModelType, Plane, Point, Segment, Vector} from "./primitives"
import {Boundaries} from "./boundaries"
import {Lazy} from "../../infrastructure/lazy"
import {Space} from "./transformations"
import {FaceType} from "./faceType"

export class Triangle implements Finite {

  private boundariesLazy: Lazy<Boundaries> = new Lazy<Boundaries>(() => this.createBoundaries())

  readonly faceType = FaceType.Triangle;

  readonly point1: Point
  readonly point2: Point
  readonly point3: Point
  readonly type: ModelType
  readonly debug: boolean

  get boundaries(): Boundaries {
    return this.boundariesLazy.value
  }

  get points(): Point[] {
    return [this.point1, this.point2, this.point3]
  }

  get triangles(): readonly Triangle[] {
    return [this]
  }

  constructor(point1: Point, point2: Point, point3: Point, type: ModelType = ModelType.Primary, debug: boolean = false) {
    if (point1.equals(point2) || point2.equals(point3) || point3.equals(point1)) {
      //throw new Error(`Triangle with equal points and end are not supported: point 1: ${point1} 2: ${point2} 3: ${point3}`)
    }
    this.point1 = point1
    this.point2 = point2
    this.point3 = point3
    this.type = type
    this.debug = debug
  }

  toSpace(space: Space) {
    const spacePoint1 = space.translate(this.point1)
    const spacePoint2 = space.translate(this.point2)
    const spacePoint3 = space.translate(this.point3)
    return new Triangle(spacePoint1, spacePoint2, spacePoint3, this.type, this.debug)
  }

  direction() {
    return Vector.fromPoints(this.point1, this.point2)
      .cross(Vector.fromPoints(this.point1, this.point3))
      .direction
  }

  plane() {
    return new Plane(this.point1, this.direction())
  }

  pointLocation(point: Point): number {
    const projection = point.projectionToPlane(this.plane())
    if (equalsTolerance(point.distanceToPoint(projection), 0)) {
      return this.inPlanePointLocation(projection)
    } else {
      return -1 // Point is outside
    }
  }

  private area() {
    const vector1 = Vector.fromPoints(this.point1, this.point2)
    const vector2 = Vector.fromPoints(this.point1, this.point3)
    return 0.5 * vector1.cross(vector2).norm
  }

  private inPlanePointLocation(point: Point) {

    if (!this.point1.equals(this.point2) && point.belongsTo(new Segment(this.point1, this.point2))
     || !this.point1.equals(this.point3) && point.belongsTo(new Segment(this.point1, this.point3))
     || !this.point3.equals(this.point2) && point.belongsTo(new Segment(this.point3, this.point2))) {
      return 0 // Point is on boundary
    }

    const area = this.area()
    const alpha = Vector.fromPoints(point, this.point2)
      .cross(Vector.fromPoints(point, this.point3))
      .norm / (2 * area)
    const beta = Vector.fromPoints(point, this.point3)
      .cross(Vector.fromPoints(point, this.point1))
      .norm / (2 * area)
    const gamma = Vector.fromPoints(point, this.point1)
      .cross(Vector.fromPoints(point, this.point2))
      .norm / (2 * area)

    if (equalsTolerance(((alpha + beta + gamma) - 1.0) * (this.ab() + this.bc() + this.ac()) / 3, 0.0)) {
      return 1 // Point is strictly inside
    } else {
      return -1
    }
  }

  ab() {
    return this.point1.distanceToPoint(this.point2)
  }

  abSegment() {
    return new Segment(this.point1, this.point2)
  }

  bc() {
    return this.point2.distanceToPoint(this.point3)
  }

  bcSegment() {
    return new Segment(this.point2, this.point3)
  }

  ac() {
    return this.point1.distanceToPoint(this.point3)
  }

  caSegment() {
    return new Segment(this.point3, this.point1)
  }

  ca() {
    return this.point3.distanceToPoint(this.point1)
  }

  toString() {
    return `triangle (${this.point1} - ${this.point2} - ${this.point3})`
  }

  key() {
    return `${this.point1}-${this.point2}-${this.point3}` // todo sort so it's always the same
  }

  disabled(debug: boolean) {
    return new Triangle(this.point1, this.point2, this.point3, ModelType.Disabled, debug)
  }

  secondary(debug: boolean) {
    return new Triangle(this.point1, this.point2, this.point3, ModelType.Secondary, debug)
  }

  third(debug: boolean) {
    return new Triangle(this.point1, this.point2, this.point3, ModelType.Third, debug)
  }

  containsSegment(segment: Segment) {
    return this.abSegment().equals(segment)
        || this.bcSegment().equals(segment)
        || this.caSegment().equals(segment)
  }

  isCoplanarTo(triangle2: Triangle) {
    return this.plane().equals(triangle2.plane())
  }

  equals(triangle: Triangle) {
    return this.point1.equals(triangle.point1)
        && this.point2.equals(triangle.point1)
        && this.point3.equals(triangle.point1)
  }

  private createBoundaries() {
    return Boundaries.fromItems(this.point1, this.point2, this.point3)
  }
}
