import {Model} from "./model"
import {segments} from "./segments"
import {Size} from "./size"
import {Point, Segment} from "./basics"
import {Triangle} from "./triangle"
import {rectangleTriangles} from "./triangles"
import {Rotation} from "./rotation"

export class AxisModel extends Model {

  private constructor(vertices: readonly Segment[], triangles: readonly Triangle[]) {
    super(vertices, triangles, AxisModel.contains(), AxisModel.onBoundary())
  }

  static create(position: Point, size: Size) {
    const segments = [
      new Segment(new Point(-1, 0, 0), new Point(1, 0,0)),
      new Segment(new Point(0, -1, 0), new Point(0, 1,0)),
      new Segment(new Point(0, 0, -1), new Point(0, 0,1)),
    ]

    const triangles = [
      new Triangle(new Point(-1, 0, 0), new Point(1, 0,0), new Point(1, 0,0)),
      new Triangle(new Point(0, -1, 0), new Point(0, 1,0), new Point(0, 1,0)),
      new Triangle(new Point(0, 0, -1), new Point(0, 0,1), new Point(0, 0,1)),
    ]

    return new AxisModel(segments, triangles)
  }

  private static contains() {
    return (coordinate: Point) => Size.default.contains(coordinate)
  }

  private static onBoundary() {
    return (coordinate: Point) => Size.default.onBoundary(coordinate)
  }
}
