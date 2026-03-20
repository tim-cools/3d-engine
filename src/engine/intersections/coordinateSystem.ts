//adaption from GeometRi by Sergey Tarasov
import {Point, Vector} from "../models"
import {Matrix3} from "./matrix3"

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
