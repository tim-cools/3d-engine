import {Model} from "./model"
import {Size} from "./size"
import {Point, Segment} from "./primitives"
import {ModelType} from "./modelType"

export class AxisModel extends Model {

  private constructor(segments: readonly Segment[]) {
    super([], segments, [], AxisModel.contains(), AxisModel.onBoundary())
  }

  static create() {
    const segments = [
      new Segment(new Point(-1, 0, 0), new Point(1, 0,0), ModelType.Utility),
      new Segment(new Point(0, -1, 0), new Point(0, 1,0), ModelType.Utility),
      new Segment(new Point(0, 0, -1), new Point(0, 0,1), ModelType.Utility),
    ]

    return new AxisModel(segments)
  }

  private static contains() {
    return (coordinate: Point) => Size.default.contains(coordinate)
  }

  private static onBoundary() {
    return (coordinate: Point) => Size.default.onBoundary(coordinate)
  }
}
