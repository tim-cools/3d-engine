import {Size} from "./size"
import {Point, Segment} from "./primitives"
import {Model} from "./model"
import {SpaceModel} from "./spaceModel"
import {Text} from "../nothing"
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

export class SubtractModel extends Model{

  protected constructor(segments: readonly Segment[], faces: readonly Face[], contains: (coordinate: Point) => boolean, onBoundary: (coordinate: Point) => boolean) {
    super(segments, faces, contains, onBoundary)
  }

  static create(master: Model, subtract: SpaceModel, newPosition: Point, scale: Size, logging: SubtractLogger | null = null): SpaceModel {

    const log: SubtractLogger = logging ? logging : noLogger()
    const segments = subtractSegments(master, subtract, log)
    const faces = subtractFaces(master, subtract, log)
    const result = new SubtractModel(segments, faces, this.notSupported, this.notSupported)

    return new SpaceModel(result, newPosition, scale)
  }

  private static notSupported(point: Point): boolean {
    throw new Error("not supported")
  }
}
