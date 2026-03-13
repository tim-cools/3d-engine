import {Size} from "./size"
import {Point, Segment} from "./primitives"
import {Model} from "./model"
import {SpaceModel} from "./spaceModel"
import {nothing, Nothing, Text} from "../nothing"
import {Face} from "./face"
import {subtractFaces} from "../operations/subtractFaces"
import {subtractSegments} from "../operations/subtractSegments"
import {Logger, noLogger} from "./logger"

export class SubtractModel extends Model {

  protected constructor(points: readonly Point[], segments: readonly Segment[], faces: readonly Face[], contains: (coordinate: Point) => boolean, onBoundary: (coordinate: Point) => boolean) {
    super(points, segments, faces, contains, onBoundary)
  }

  static create(master: Model, subtract: SpaceModel, logging: Logger | Nothing = nothing): SubtractModel {

    const log: Logger = logging ? logging : noLogger()
    const wireframe = subtractSegments(master, subtract, log)
    const {points, segments, faces} = subtractFaces(master, subtract, log)

    return new SubtractModel(points, [...wireframe, ...segments], faces, this.notSupported, this.notSupported)
  }

  private static notSupported(point: Point): boolean {
    throw new Error("not supported")
  }
}
