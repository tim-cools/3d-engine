import {Point2D} from "./primitives"

export class Segment2D {

  readonly begin: Point2D
  readonly end: Point2D

  constructor(begin: Point2D, end: Point2D) {
    this.begin = begin
    this.end = end
  }

  includes(point: Point2D, margin: number) {

    const beginX = Math.min(this.begin.x, this.end.x)
    const endX = Math.max(this.begin.x, this.end.x)
    const beginY = Math.min(this.begin.y, this.end.y)
    const endY = Math.max(this.begin.y, this.end.y)
    const lengthX = endX - beginX
    const lengthY = endY - beginY

    if (lengthX > lengthY) {
      return Segment2D.includesPoint(point.x, beginX, endX, lengthX, point.y, beginY, lengthY, margin)
    } else {
      return Segment2D.includesPoint(point.y, beginY, endY, lengthY, point.x, beginX, lengthX, margin)
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
