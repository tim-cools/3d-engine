import {Point, TransformablePoint} from "./primitives"
import {multiply, transform} from "./transformations"
import {betweenTolerance, equalsTolerance} from "./equals"

export class Size {

  static null: Size = new Size(0, 0, 0)
  static default: Size = new Size(1, 1, 1)
  static half: Size = new Size(.5, .5, .5)
  static quarter: Size = new Size(.25, .25, .25)

  readonly x: number
  readonly y: number
  readonly z: number

  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  transform(value: Point): TransformablePoint {
    const coordinate = transform(value, [multiply(this)])
    return new TransformablePoint(coordinate)
  }

  contains(coordinate: Point) {
    return betweenTolerance(coordinate.x, 0, this.x)
        && betweenTolerance(coordinate.y, 0, this.y)
        && betweenTolerance(coordinate.z, 0, this.z)
  }

  onBoundary(coordinate: Point) {
    return (equalsTolerance(coordinate.x, 0) && betweenTolerance(coordinate.y, 0, this.y) && betweenTolerance(coordinate.z, 0, this.z))
      || (equalsTolerance(coordinate.x, this.x) && betweenTolerance(coordinate.y, 0, this.y) && betweenTolerance(coordinate.z, 0, this.z))
      || (equalsTolerance(coordinate.y, 0) && betweenTolerance(coordinate.x, 0, this.x) && betweenTolerance(coordinate.z, 0, this.z))
      || (equalsTolerance(coordinate.y, this.y) && betweenTolerance(coordinate.x, 0, this.x) && betweenTolerance(coordinate.z, 0, this.z))
      || (equalsTolerance(coordinate.z, 0) && betweenTolerance(coordinate.y, 0, this.y) && betweenTolerance(coordinate.x, 0, this.x))
      || (equalsTolerance(coordinate.z, this.z) && betweenTolerance(coordinate.y, 0, this.y) && betweenTolerance(coordinate.x, 0, this.x))
  }

  half() {
    return new Point(this.x / 2, this.y / 2, this.z / 2)
  }

  minus() {
    return new Point(-this.x, -this.y, -this.z)
  }

  multiply(size: Size): Size {
    return new Size(this.x * size.x, this.y * size.y, this.z * size.z)
  }

  static single(number: number) {
    return new Size(number, number, number)
  }
}
