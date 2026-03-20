import {Point} from "./primitives"
import {Model} from "./model"
import {nothing, Nothing,} from "../nothing"
import {DebugInfo, subtractFaces, subtractSegments, SubtractModels} from "../intersections"
import {Logger, noLogger} from "./logger"

export class Subtract {

  static segments(models: SubtractModels, logging: Logger | Nothing = nothing): Model {

    const log: Logger = logging ? logging : noLogger()
    const {points, segments, faces} = subtractSegments(models, log)

    return new Model(points, segments, faces, this.notSupported, this.notSupported)
  }

  static faces(models: SubtractModels, logging: Logger | Nothing = nothing, debugInfo: DebugInfo | Nothing = nothing): Model {

    const log: Logger = logging ? logging : noLogger()
    const {points, segments, faces} = subtractFaces(models, log, debugInfo)

    return new Model(points, segments, faces, this.notSupported, this.notSupported)
  }

  private static notSupported(point: Point): boolean {
    throw new Error("not supported")
  }
}
