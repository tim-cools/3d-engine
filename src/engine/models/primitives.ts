import {Space, transform, Transformer} from "./transformations"
import {equalsTolerance, tolerance} from "./equals"
import {Size} from "./size"
import {Colors} from "../colors"
import {Lazy} from "../../infrastructure/lazy"
import {Nothing} from "../nothing"

export enum ModelType {
  Primary,
  Secondary,
  Third,
  Utility,
  UtilityLight,
  Disabled,
}

export function modelColor(modelType: ModelType) {
  if (modelType == ModelType.Primary) {
    return Colors.primary.middle
  } else if (modelType == ModelType.Secondary) {
    return Colors.secondary.middle
  } else if (modelType == ModelType.Third) {
    return Colors.third.middle
  } else if (modelType == ModelType.Utility) {
    return Colors.gray.darker
  } else if (modelType == ModelType.UtilityLight) {
    return Colors.gray.lighter
  } else if (modelType == ModelType.Disabled){
    return Colors.primary.light
  }
  throw new Error("Unknown model type: " + ModelType[modelType])
}

export interface Finite {
  pointLocation(point: Point): number
}

export interface Linear {
  direction: Vector
  isOriented: boolean
}

export interface Coordinate {
  readonly x: number
  readonly y: number
  readonly z: number
}

function angleTo(obj1: Linear, obj2: Linear): number {

  if (obj1.isOriented && obj2.isOriented) {
    const product = obj1.direction.dot(obj2.direction)
    if (product > 1) {
      Math.acos(1)
    } else if (product < -1) {
      Math.acos(-1)
    }
    return Math.acos(product)
  }

  // return smallest angle
  const angle = angleTo(obj1.direction, obj2.direction)
  if (angle <= Math.PI / 2) {
    return angle
  } else {
    return Math.PI - angle
  }
}

export class Point implements Coordinate {

  static null: Point = new Point(0, 0, 0)
  static middle: Point = new Point(.5, .5, .5)
  static one: Point = new Point(1, 1, 1)

  private xValue: number
  private yValue: number
  private zValue: number

  get x(): number {
    return this.xValue
  }

  get y(): number {
    return this.yValue
  }

  get z(): number {
    return this.zValue
  }

  readonly type: ModelType
  readonly debug: boolean

  constructor(x: number, y: number, z: number, type: ModelType = ModelType.Primary, debug: boolean = false) {
    this.xValue = x
    this.yValue = y
    this.zValue = z
    this.type = type
    this.debug = debug
  }

  equals(value: Point): boolean {
    const distance = this.distanceSquared(value)
    return distance < tolerance * tolerance
  }

  toString(): string {
    return `x: ${this.x.toFixed(5)}, y: ${this.y.toFixed(5)}, z: ${this.z.toFixed(5)}`
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
    return vector.cross(line.direction).norm
  }

  belongsTo(object: Finite): boolean {
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
    return this.subtract(plane.direction.multiplyNumber(plane.direction.dot(delta)))
  }

  subtract(value: Coordinate) {
    return new Point(this.x - value.x, this.y - value.y, this.z - value.z)
  }

  add(value: Coordinate) {
    return new Point(this.x + value.x, this.y + value.y, this.z + value.z)
  }

  multiplySize(size: Size) {
    return new Point(this.x * size.x, this.y * size.y, this.z * size.z)
  }

  divide(number: number) {
    return new Point(this.x / number, this.y / number, this.z / number)
  }

  belongsToPlane(plane: Plane) {
    return Math.abs(plane.a * this.x + plane.b * this.y + plane.c * this.z + plane.d)
      / Math.sqrt(plane.a * plane.a + plane.b * plane.b + plane.c * plane.c)
      < tolerance
  }

  belongsToRay(ray: Ray) {

    if (this.equals(ray.point)) {
      return true;
    }

    let line = ray.line()

    if (this.distanceToLine(line) > tolerance) {
      return false
    }

    const projection = this.projectionToLine(line)
    const vector = Vector.fromPoints(ray.point, projection)

    return angleTo(vector, ray.direction) < Math.PI / 4;

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

  third(debug: boolean) {
    return new Point(this.x, this.y, this.z, ModelType.Third, debug)
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

  static single(number: number) {
    return new Point(number, number, number)
  }

  toSpace(space: Space) {
    return space.translate(this);
  }
}

export class TransformablePoint extends Point {

  private readonly original: Point

  constructor(point: Point) {
    super(point.x, point.y, point.z)
    this.original = point
  }

  static new(x: number, y: number, z: number) {
    const coordinate = new Point(x, y, z)
    return new TransformablePoint(coordinate)
  }

  transform(transformers: readonly Transformer[]) {
    super.set(transform(this.original, transformers))
  }
}

export class Point2D {

  readonly x: number
  readonly y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  translate(coordinate: Point) {
    return new Point2D(this.x + coordinate.x, this.y + coordinate.y)
  }
}

export class Plane {

  private static xyLazy: Lazy<Plane> = new Lazy<Plane>(() => Plane.fromAbcd(0, 0, 1, 0))
  private static xzLazy: Lazy<Plane> = new Lazy<Plane>(() => Plane.fromAbcd(0, 1, 0, 0))
  private static yzLazy: Lazy<Plane> = new Lazy<Plane>(() => Plane.fromAbcd(1, 0, 0, 0))

  static get xy(): Plane {
    return Plane.xyLazy.value
  }

  static get xz(): Plane {
    return Plane.xzLazy.value
  }

  static get yz(): Plane {
    return Plane.yzLazy.value
  }

  readonly point: Point
  readonly direction: Vector

  readonly a: number
  readonly b: number
  readonly c: number
  readonly d: number

  constructor(point: Point, direction: Vector) {
    this.point = point
    this.direction = direction
    this.a = direction.x
    this.b = direction.y
    this.c = direction.z
    this.d = -direction.x * point.x - direction.y * point.y - direction.z * point.z
  }

  isParallelTo(plane: Plane) {
    return this.direction.isParallelTo(plane.direction);
  }

  asVector() {
    return new Vector(this.a, this.b, this.c)
  }

  static fromAbcd(a: number, b: number, c: number, d: number) {
    let point: Point
    if (Math.abs(a) > Math.abs(b) && Math.abs(a) > Math.abs(c)) {
      point = new Point(-d / a, 0, 0);
    } else if (Math.abs(b) > Math.abs(a) && Math.abs(b) > Math.abs(c)) {
      point = new Point(0, -d / b, 0);
    } else {
      point = new Point(0, 0, -d / c);
    }
    const direction = new Vector(a, b, c).direction;
    return new Plane(point, direction)
  }

  equals(plane: Plane) {

    if (!this.direction.isParallelTo(plane.direction)) {
      return false
    }

    if (this.point.equals(plane.point)) {
      return true
    }

    const v = Vector.fromPoints(this.point, plane.point).direction
    const a = v.dot(plane.direction.direction)
    return Math.abs(a) <= tolerance
  }
}

export class Vector implements Coordinate, Linear {

  private normLazy = new Lazy(() => this.getNorm())
  private directionLazy = new Lazy(() => this.getNormal())

  readonly x: number
  readonly y: number
  readonly z: number
  readonly isOriented = true

  get norm(): number {
    return this.normLazy.value
  }

  get direction(): Vector {
    return this.directionLazy.value
  }

  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  cross(vector: Vector): Vector {
    const x = this.y * vector.z - this.z * vector.y
    const y = this.z * vector.x - this.x * vector.z
    const z = this.x * vector.y - this.y * vector.x
    return new Vector(x, y, z)
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
    const dotOfDirections = this.direction.dot(vector.direction)
    return equalsTolerance(dotOfDirections, 1.0)
  }

  isOrthogonalTo(object: Linear) {
    const direction1 = object.direction
    const this_norm = this.norm
    const directionNorm = direction1.norm
    return equalsTolerance(Math.abs(this.dot(direction1)) / (this_norm * directionNorm), 0.0)
  }

  private getNormal() {
    const factor = 1.0 / this.norm
    return new Vector(
      this.x * factor,
      this.y * factor,
      this.z * factor)
  }

  getNorm() {
    return Math.sqrt(
      this.x * this.x
      + this.y * this.y
      + this.z * this.z)
  }

  static fromPoints(point1: Point, point2: Point) {
    return new Vector(
      point2.x - point1.x,
      point2.y - point1.y,
      point2.z - point1.z)
  }

  equals(vector: Vector) {
    return equalsTolerance(this.x, vector.x) && equalsTolerance(this.y, vector.y) && equalsTolerance(this.z, vector.z)
  }
}

export class Line {

  readonly point: Point
  readonly direction: Vector

  constructor(point1: Point, direction: Vector) {
    this.point = point1
    this.direction = direction
  }

  static fromPoints(point1: Point, point2: Point) {
    const direction = Vector.fromPoints(point1, point2).direction
    return new Line(point1, direction)
  }

  toString() {
    return `point (${this.point}) direction (${this.direction})`
  }

  perpendicularTo(line: Line): Point | Nothing {

    const r1 = this.point.vector()
    const r2 = line.point.vector()
    const s1 = this.direction
    const s2 = line.direction

    const s1CrossS2 = s1.cross(s2)
    const parallel = s1CrossS2.norm <= tolerance

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

  equals(line: Line) {
    return this.point.equals(line.point) && this.direction.equals(line.direction)
  }
}

export class Ray implements Linear {

  readonly point: Point
  readonly direction: Vector
  readonly isOriented = false

  constructor(point: Point, direction: Vector) {
    this.point = point
    this.direction = direction
  }

  line() {
    return new Line(this.point, this.direction)
  }

  static fromPoints(point: Point, point2: Point) {
    const direction = Vector.fromPoints(point, point2).direction
    return new Ray(point, direction)
  }
}

export class Segment implements Finite {

  readonly begin: Point
  readonly end: Point
  readonly type: ModelType
  readonly debug: boolean

  constructor(begin: Point, end: Point, type: ModelType = ModelType.Primary, debug: boolean = false) {
    if (begin.equals(end)) {
      //throw new Error(`Segments with equal begin and end are not supported: begin: ${begin} end: ${end}`)
    }
    this.begin = begin
    this.end = end
    this.type = type
    this.debug = debug
  }

  toString() {
    return `begin (${this.begin}) end (${this.end}) [${ModelType[this.type]}${this.debug ? " debug" : ""}]`
  }

  line() {
    return Line.fromPoints(this.begin, this.end)
  }

  vector() {
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

  length(): number {
    return this.begin.distanceToPoint(this.end)
  }

  equals(segment: Segment) {
    return (this.begin.equals(segment.begin) && this.end.equals(segment.end))
        || (this.begin.equals(segment.end) && this.end.equals(segment.begin))
  }

  belongsToLine(line: Line) {
    return this.begin.belongsToLine(line) && this.end.belongsToLine(line)
  }

  disabled(debug: boolean = false) {
    return new Segment(this.begin, this.end, ModelType.Disabled, debug)
  }

  secondary(debug: boolean = false) {
    return new Segment(this.begin, this.end, ModelType.Secondary, debug)
  }

  third(debug: boolean = false) {
    return new Segment(this.begin, this.end, ModelType.Third, debug)
  }

  toSpace(space: Space) {
    let spaceBegin = space.translate(this.begin)
    let spaceEnd = space.translate(this.end)
    return new Segment(spaceBegin, spaceEnd, this.type, this.debug)
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
}
