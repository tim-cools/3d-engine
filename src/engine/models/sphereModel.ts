import {Size, Point, rotateY, rotateZ, Model, Segment, Triangle} from "../models"
import {betweenTolerance, equalsTolerance} from "./equals"

const size = 1;
const half = size / 2;

export class SphereModel extends Model {

  private constructor(vertices: readonly Segment[], triangles: readonly Triangle[]) {
    super(vertices, triangles, SphereModel.contains(), SphereModel.onBoundary())
  }

  static create(segmentsNumber: number): SphereModel {

    const {segments, triangles} = this.createSphere(segmentsNumber)

    return new SphereModel(segments, triangles)
  }

  public static createSphere(segmentsNumber: number): {segments: Segment[], triangles: Triangle[]} {

    const pi = Math.PI;
    const startTop = new Point(0, -half, 0);

    const segments: Segment[] = [];
    const triangles: Triangle[] = [];
    const rotateNext = rotateY(pi / segmentsNumber);

    for (let indexHorizontal = 0; indexHorizontal <= segmentsNumber * 2; indexHorizontal++) {

      const rotateHorizontal = rotateY(pi / segmentsNumber * indexHorizontal);
      let valueVertical = startTop;
      for (let indexVertical = 0; indexVertical <= segmentsNumber; indexVertical++) {

        const rotateVertical = rotateZ(pi / segmentsNumber * indexVertical);
        const nextVertical = rotateHorizontal(rotateVertical(startTop));

        segments.push(new Segment(valueVertical, nextVertical));

        if (indexVertical > 0 && indexVertical <= segmentsNumber) {
          const nextHorizontal = rotateNext(valueVertical);
          segments.push(new Segment(valueVertical, nextHorizontal));

          const nextVerticalHorizontal = rotateNext(nextVertical);
          triangles.push(new Triangle(valueVertical, nextVertical, nextHorizontal))
          triangles.push(new Triangle(nextVertical, nextHorizontal, nextVerticalHorizontal))
        }

        valueVertical = nextVertical;
      }
    }

    return {segments, triangles};
  }

  private static contains() {
    return (point: Point) => betweenTolerance(Point.null.distanceToPoint(point), 0, half)
  }

  private static onBoundary() {
    return (point: Point) => equalsTolerance(Point.null.distanceToPoint(point), half)
  }
}
