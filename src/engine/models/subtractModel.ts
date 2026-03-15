import {Point} from "./primitives"
import {Model} from "./model"
import {SpaceModel} from "./spaceModel"
import {nothing, Nothing,} from "../nothing"
import {subtractFaces} from "../operations/subtractFaces"
import {subtractSegments} from "../operations/subtractSegments"
import {Logger, noLogger} from "./logger"

export class SubtractModels {

  readonly master: Model
  readonly subtract: SpaceModel

  constructor(master: Model, subtract: SpaceModel) {
    this.master = master
    this.subtract = subtract
  }
}

export class Subtract {

  static segments(models: SubtractModels, logging: Logger | Nothing = nothing): Model {

    const log: Logger = logging ? logging : noLogger()
    const wireframe = subtractSegments(models.master, models.subtract, log)

    return new Model([], [...wireframe], [], this.notSupported, this.notSupported)
  }

  static faces(models: SubtractModels, logging: Logger | Nothing = nothing): Model {

    const log: Logger = logging ? logging : noLogger()
    const {points, segments, faces} = subtractFaces(models.master, models.subtract, log)

    return new Model(points, segments, faces, this.notSupported, this.notSupported)
  }

  private static notSupported(point: Point): boolean {
    throw new Error("not supported")
  }
}
