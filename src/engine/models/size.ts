import {Point, TransformablePoint} from "./basics"
import {multiply, transform} from "./transformations"
import {betweenTolerance, equalsTolerance} from "./equals"

export class Size {

  public static null: Size = new Size(0, 0, 0)
  public static default: Size = new Size(1, 1, 1)
  public static half: Size = new Size(.5, .5, .5)

  public readonly x: number
  public readonly y: number
  public readonly z: number

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
    return coordinate.x >= 0 && coordinate.x <= this.x
        && coordinate.y >= 0 && coordinate.y <= this.y
        && coordinate.z >= 0 && coordinate.z <= this.z
  }

  onBoundary(coordinate: Point) {
    return (equalsTolerance(coordinate.x, 0) && betweenTolerance(coordinate.y, 0, this.y) && betweenTolerance(coordinate.z, 0, this.z))
      || (equalsTolerance(coordinate.x, this.x) && betweenTolerance(coordinate.y, 0, this.y) && betweenTolerance(coordinate.z, 0, this.z))
      || (equalsTolerance(coordinate.y, 0) && betweenTolerance(coordinate.x, 0, this.x) && betweenTolerance(coordinate.z, 0, this.z))
      || (equalsTolerance(coordinate.y, this.y) && betweenTolerance(coordinate.x, 0, this.x) && betweenTolerance(coordinate.z, 0, this.z))
      || (equalsTolerance(coordinate.z, 0) && betweenTolerance(coordinate.y, 0, this.y) && betweenTolerance(coordinate.x, 0, this.x))
      || (equalsTolerance(coordinate.z, this.z) && betweenTolerance(coordinate.y, 0, this.y) && betweenTolerance(coordinate.x, 0, this.x));
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
}
