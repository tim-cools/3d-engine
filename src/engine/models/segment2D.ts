import {Point2D} from "./primitives"

export class Segment2D {

  readonly begin: Point2D
  readonly end: Point2D

  constructor(begin: Point2D, end: Point2D) {
    this.begin = begin
    this.end = end
  }

  includes(point: Point2D, margin: number) {

    const lengthX = this.end.x - this.begin.x
    const lengthY = this.end.y - this.begin.y

    if (lengthX > lengthY) {
      return Segment2D.includesPoint(point.x, this.begin.x, this.end.x, lengthX, point.y, this.begin.y, lengthY, margin)
    } else {
      return Segment2D.includesPoint(point.y, this.begin.y, this.end.y, lengthY, point.x, this.begin.x, lengthX, margin)
    }
  }

  private static includesPoint(thisPoint: number, thisBegin: number, thisEnd: number, length: number, otherPoint: number, otherBegin: number, otherLength: number, margin: number) {

    if (thisPoint < thisBegin - margin || thisPoint > thisEnd + margin) {
      return false
    }

    let ratio = (thisPoint - thisBegin) / length
    ratio = Math.max(0, Math.min(1, ratio))
    const projected = otherBegin + otherLength * ratio

    return otherPoint >= projected - margin && otherPoint <= projected + margin
  }
}
