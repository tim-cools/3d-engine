import {Size} from "./size"
import {Point, Segment} from "./primitives"
import {Model} from "./model"
import {SpaceModel} from "./spaceModel"
import {nothing, Nothing, Text} from "../nothing"
import {Face} from "./face"
import {subtractFaces} from "../operations/subtractFaces"
import {subtractSegments} from "../operations/subtractSegments"

export interface SubtractLogger {
  logLine(message: Text): void
  log(segment: Segment, message: Text): void
}

function noLogger(): SubtractLogger {
  return {
    logLine: function (message: Text) {},
    log: function (segment: Segment, message: Text) {}
  }
}

export class SubtractModel extends Model {

  protected constructor(points: readonly Point[], segments: readonly Segment[], faces: readonly Face[], contains: (coordinate: Point) => boolean, onBoundary: (coordinate: Point) => boolean) {
    super(points, segments, faces, contains, onBoundary)
  }

  static create(master: Model, subtract: SpaceModel, newPosition: Point, scale: Size, logging: SubtractLogger | Nothing = nothing): SpaceModel {

    const log: SubtractLogger = logging ? logging : noLogger()
    const wireframe = subtractSegments(master, subtract, log)
    const {points, segments, faces} = subtractFaces(master, subtract, log)
    const result = new SubtractModel(points, [...wireframe, ...segments], faces, this.notSupported, this.notSupported)

    return new SpaceModel(result, newPosition, scale)
  }

  private static notSupported(point: Point): boolean {
    throw new Error("not supported")
  }
}
