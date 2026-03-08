//adaption from GeometRi by Sergey Tarasov
import {Vector} from "../models"
import {Point} from "../models"

export class Matrix3 {

  private values: number[][] = []

  public get determinant(): number {
    const k11 = this.values[2][2] * this.values[1][1] - this.values[2][1] * this.values[1][2]
    const k12 = this.values[2][1] * this.values[0][2] - this.values[2][2] * this.values[0][1]
    const k13 = this.values[1][2] * this.values[0][1] - this.values[1][1] * this.values[0][2]
    return this.values[0][0] * k11 + this.values[1][0] * k12 + this.values[2][0] * k13
  }

  constructor(row1: Vector, row2: Vector, row3: Vector) {
    this.values[0] = Matrix3.row(row1)
    this.values[1] = Matrix3.row(row2)
    this.values[2] = Matrix3.row(row3)
  }

  private static row(row1: Vector) {
    return [row1.x, row1.y, row1.z]
  }

  multiply(value: Point): Point {
    const x = this.values[0][0] * value.x + this.values[0][1] * value.y + this.values[0][2] * value.z
    const y = this.values[1][0] * value.x + this.values[1][1] * value.y + this.values[1][2] * value.z
    const z = this.values[2][0] * value.x + this.values[2][1] * value.y + this.values[2][2] * value.z
    return new Point(x, y, z)
  }

  transposeMultiply(value: Point): Point {
    const x = this.values[0][0] * value.x + this.values[1][0] * value.y + this.values[2][0] * value.z
    const y = this.values[0][1] * value.x + this.values[1][1] * value.y + this.values[2][1] * value.z
    const z = this.values[0][2] * value.x + this.values[1][2] * value.y + this.values[2][2] * value.z
    return new Point(x, y, z)
  }
}

export class CoordinateSystem {

  private readonly origin: Point
  private readonly axes: Matrix3

  constructor(point: Point, xAxisVector: Vector, xyPlaneVector: Vector) {

    if (xAxisVector.isParallelTo(xyPlaneVector)) {
      throw new Error("Vectors are parallel")
    }

    xAxisVector = xAxisVector.direction
    const vector3 = xAxisVector.cross(xyPlaneVector).direction
    xyPlaneVector = vector3.cross(xAxisVector).direction

    this.origin = point
    this.axes = new Matrix3(xAxisVector, xyPlaneVector, vector3)
  }

  convert(point: Point): Point {
    let result = point.subtract(this.origin)
    return this.axes.multiply(result)
  }

  toGlobal(point: Point): Point {
    const result = this.axes.transposeMultiply(point)
    return result.add(this.origin)
  }
}
