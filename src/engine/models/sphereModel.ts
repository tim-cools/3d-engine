import {Point, rotateY, rotateZ, Model, Segment, Triangle, Face} from "../models"
import {betweenTolerance, equalsTolerance} from "./equals"

const size = 1
const half = size / 2

export class SphereModel extends Model {

  private constructor(segments: readonly Segment[], faces: readonly Face[]) {
    super([], segments, faces, SphereModel.contains(), SphereModel.onBoundary())
  }

  static create(segmentsNumber: number): SphereModel {

    const {segments, triangles} = this.createSphere(segmentsNumber)

    return new SphereModel(segments, triangles)
  }

  static createSphere(segmentsNumber: number): {segments: Segment[], triangles: Triangle[]} {

    const pi = Math.PI
    const startTop = new Point(0, -half, 0)

    const segments: Segment[] = []
    const triangles: Triangle[] = []
    const rotateNext = rotateY(pi / segmentsNumber)

    for (let indexHorizontal = 1; indexHorizontal <= segmentsNumber * 2; indexHorizontal++) {

      const rotateHorizontal = rotateY(pi / segmentsNumber * indexHorizontal)
      let valueVertical = startTop

      for (let indexVertical = 1; indexVertical <= segmentsNumber; indexVertical++) {

        const rotateVertical = rotateZ(pi / segmentsNumber * indexVertical)
        const nextVertical = rotateHorizontal(rotateVertical(startTop))

        segments.push(new Segment(valueVertical, nextVertical))

        const nextHorizontal = rotateNext(valueVertical)
        const nextVerticalHorizontal = rotateNext(nextVertical)

        if (indexVertical >= 2) {
          segments.push(new Segment(valueVertical, nextHorizontal))
          //first and last row have only one triangle, all other rows two
          triangles.push(new Triangle(valueVertical, nextVertical, nextHorizontal))
        }
        if (indexVertical < segmentsNumber) {
          triangles.push(new Triangle(nextVertical, nextHorizontal, nextVerticalHorizontal))
        }

        valueVertical = nextVertical
      }
    }

    return {segments, triangles}
  }

  private static contains() {
    return (point: Point) => betweenTolerance(Point.null.distanceToPoint(point), 0, half)
  }

  private static onBoundary() {
    return (point: Point) => equalsTolerance(Point.null.distanceToPoint(point), half)
  }
}
