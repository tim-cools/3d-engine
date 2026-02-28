import {transform, Transformer} from "./transformations"
import {equalsTolerance, tolerance} from "./equals"
import {Size} from "./size"

export interface FiniteObject {
  pointLocation(point: Point): number
}

export interface LinearObject {
  direction(): Vector
}

export interface Coordinate
{
  readonly x: number
  readonly y: number
  readonly z: number
}

export class Point implements Coordinate {

  public static null: Point = new Point(0, 0, 0)
  public static middle: Point = new Point(.5, .5, .5)
  public static one: Point = new Point(1, 1, 1)

  private xValue: number
  private yValue: number
  private zValue: number

  public get x(): number {
    return this.xValue
  }

  public get y(): number {
    return this.yValue
  }

  public get z(): number {
    return this.zValue
  }

  constructor(x: number, y: number, z: number) {
    this.xValue = x
    this.yValue = y
    this.zValue = z
  }

  equals(value: Point): boolean {
    const distance = this.distanceSquared(value)
    return distance < tolerance * tolerance
  }

  toString(): string {
    return `x: ${this.x}, y: ${this.y}, z: ${this.z}`
  }

  vector() {
    return new Vector(this.xValue, this.yValue, this.zValue)
  }

  distanceToPoint(point: Point) {
    return Math.sqrt(
      (this.x - point.x) * (this.x - point.x)
      + (this.y - point.y) * (this.y - point.y)
      + (this.z - point.z) * (this.z - point.z))
  }

  distanceToLine(line: Line) {
    const vector = Vector.fromPoints(this, line.point)
    return vector.cross(line.direction).norm()
  }

  belongsTo(object: FiniteObject): boolean {
    return object.pointLocation(this) >= 0
  }

  belongsToLine(line: Line): boolean {
    return this.distanceToLine(line) <= tolerance
  }

  projectionToLine(line: Line) {
    const r0 = this.vector()
    const r1 = line.point.vector()
    const s = line.direction
    const value = r1.subtract(s.multiplyNumber(r1.subtract(r0).dot(s) / s.dot(s)))
    return value.point()
  }

  projectionToPlane(plane: Plane): Point {
    const delta = Vector.fromPoints(plane.point, this)
    return this.subtract(plane.normal.multiplyNumber(plane.normal.dot(delta)))
  }

  subtract(value: Coordinate) {
    return new Point(this.x - value.x, this.y - value.y, this.z - value.z)
  }

  add(value: Point) {
    return new Point(this.x + value.x, this.y + value.y, this.z + value.z)
  }

  multiplySize(size: Size) {
    return new Point(this.x * size.x, this.y * size.y, this.z * size.z)
  }

  belongsToPlane(plane: Plane) {
    return Math.abs(plane.a * this.x + plane.b * this.y + plane.c * this.z + plane.d)
      / Math.sqrt(plane.a * plane.a + plane.b * plane.b + plane.c * plane.c)
      < tolerance
  }

  dot(vector: Vector): number {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z
  }

  translate(vector: Vector): Point {
    return this.add(vector.point())
  }

  negate() {
    return new Point(-this.x, -this.y, -this.z)
  }

  protected set(point: Point) {
    this.xValue = point.x
    this.yValue = point.y
    this.zValue = point.z
  }

  private distanceSquared(value: Point) {
    const distanceX = this.x - value.x
    const distanceY = this.y - value.y
    const distanceZ = this.z - value.z
    return distanceX * distanceX + distanceY * distanceY + distanceZ * distanceZ
  }

  static min(value1: Point, value2: Point) {
    return new Point(Math.min(value1.x, value2.x), Math.min(value1.y, value2.y), Math.min(value1.z, value2.z))
  }

  static max(value1: Point, value2: Point) {
    return new Point(Math.max(value1.x, value2.x), Math.max(value1.y, value2.y), Math.max(value1.z, value2.z))
  }

}

export class TransformablePoint extends Point {

  private readonly original: Point

  constructor(point: Point) {
    super(point.x, point.y, point.z)
    this.original = point
  }

  public static new(x: number, y: number, z: number) {
    const coordinate = new Point(x, y, z)
    return new TransformablePoint(coordinate)
  }

  transform(transformers: readonly Transformer[]) {
    super.set(transform(this.original, transformers))
  }
}

export class Point2D {

  public readonly x: number
  public readonly y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  translate(coordinate: Point) {
    return new Point2D(this.x + coordinate.x, this.y + coordinate.y)
  }
}

export class Plane {

  readonly point: Point
  readonly normal: Vector

  readonly a: number
  readonly b: number
  readonly c: number
  readonly d: number

  constructor(point: Point, normal: Vector) {
    this.point = point
    this.normal = normal
    this.a = normal.x
    this.b = normal.y
    this.c = normal.z
    this.d = -normal.x * point.x - normal.y * point.y - normal.z * point.z
  }
}

export class Vector implements Coordinate, LinearObject {

  readonly x: number
  readonly y: number
  readonly z: number

  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  normalize() {
    const norm = this.norm()
    const factor = 1.0 / norm
    return new Vector(
      this.x * factor,
      this.y * factor,
      this.z * factor)
  }

  direction() {
    return this.normalize()
  }

  cross(vector: Vector): Vector {
    const x = this.y * vector.z - this.z * vector.y
    const y = this.z * vector.x - this.x * vector.z
    const z = this.x * vector.y - this.y * vector.x
    return new Vector(x, y, z)
  }

  norm() {
    return Math.sqrt(
      this.x * this.x
      + this.y * this.y
      + this.z * this.z)
  }

  add(vector: Vector): Vector {
    return new Vector(
      this.x + vector.x,
      this.y + vector.y,
      this.z + vector.z)
  }

  subtract(vector: Vector): Vector {
    return new Vector(
      this.x - vector.x,
      this.y - vector.y,
      this.z - vector.z)
  }

  multiplyNumber(factor: number): Vector {
    return new Vector(
      this.x * factor,
      this.y * factor,
      this.z * factor)
  }

  multiply(value: Coordinate): Vector {
    return new Vector(
      this.x * value.x,
      this.y * value.y,
      this.z * value.z)
  }

  divide(vector: Vector): Vector {
    return new Vector(
      this.x / vector.x,
      this.y / vector.y,
      this.z / vector.z)
  }

  dot(vector: Vector): number {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z
  }

  point() {
    return new Point(this.x, this.y, this.z)
  }

  orthogonalVector(): Vector {
    let absX = Math.abs(this.x)
    let absY = Math.abs(this.y)
    let absZ = Math.abs(this.z)
    if (absX <= absY && absX <= absZ) {
      return new Vector(0, this.z, -this.y)
    } else if (absY <= absX && absY <= absZ) {
      return new Vector(this.z, 0, -this.x)
    } else {
      return new Vector(this.y, -this.x, 0)
    }
  }

  isParallelTo(vector: Vector) {
    const dotOfDirections = this.normalize().dot(vector.normalize())
    return equalsTolerance(dotOfDirections, 1.0)
  }

  isOrthogonalTo(object: LinearObject) {
    const v = object.direction()
    const this_norm = this.norm()
    const v_norm = v.norm()
    return equalsTolerance(Math.abs(this.dot(v)) / (this_norm * v_norm), 0.0)
  }

  static fromPoints(point1: Point, point2: Point) {
    return new Vector(
      point2.x - point1.x,
      point2.y - point1.y,
      point2.z - point1.z)
  }
}

export class Line {

  readonly point: Point
  readonly direction: Vector

  constructor(point1: Point, point2: Point) {
    this.point = point1
    this.direction = Vector.fromPoints(point1, point2).normalize()
  }

  public toString() {
    return `point (${this.point}) direction (${this.direction})`
  }

  perpendicularTo(line: Line): Point | null {

    const r1 = this.point.vector()
    const r2 = line.point.vector()
    const s1 = this.direction
    const s2 = line.direction

    const s1CrossS2 = s1.cross(s2)
    const parallel = s1CrossS2.norm() <= tolerance

    if (parallel) {
      return null
    }

    const vectorR2R1 = r2.subtract(r1)
    const crossS1crossS2 = s1.cross(s1CrossS2)
    const s1multiplyS1CrossS2 = s1.dot(s2.cross(s1CrossS2))

    const value = r2.add(
      s2.multiplyNumber(vectorR2R1.dot(crossS1crossS2) / s1multiplyS1CrossS2))

    return value.point()
  }
}


export class Segment implements FiniteObject {

  public readonly begin: Point
  public readonly end: Point

  constructor(begin: Point, end: Point) {
    this.begin = begin
    this.end = end
  }

  public toString() {
    return `begin (${this.begin}) end (${this.end})`
  }

  public line() {
    return new Line(this.begin, this.end)
  }

  public vector() {
    return Vector.fromPoints(this.begin, this.end)
  }

  pointLocation(point: Point) {
    const projection = point.projectionToLine(this.line())
    if (equalsTolerance(point.distanceToPoint(projection),0)) {
      return this.axialPointLocation(point)
    } else {
      return -1 // Point is outside
    }
  }

  private axialPointLocation(point: Point) {

    const distanceBegin = point.distanceToPoint(this.begin)
    if (equalsTolerance(distanceBegin, 0)){
      return 0
    }
    const distanceEnd = point.distanceToPoint(this.end)
    if (equalsTolerance(distanceEnd, 0)) {
      return 0
    }

    const length = this.length()
    let pointStrictlyInside = distanceBegin <= length && distanceEnd <= length
    if (pointStrictlyInside) {
      return 1 // // Point is strictly inside
    }

    if (distanceBegin < distanceEnd) {
      return -1 // Point is outside of the P1
    } else {
      return -2 // Point is outside of the P2
    }
  }

  public length(): number {
    return this.begin.distanceToPoint(this.end)
  }

  equals(lineSegment: Segment) {
    return (this.begin.equals(lineSegment.begin) && this.end.equals(lineSegment.end))
      || (this.begin.equals(lineSegment.end) && this.end.equals(lineSegment.begin))
  }

  belongsToLine(line: Line) {
    return this.begin.belongsToLine(line) && this.end.belongsToLine(line)
  }
}
