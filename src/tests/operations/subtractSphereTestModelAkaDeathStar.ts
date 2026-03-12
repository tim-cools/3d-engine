import {Point, Size, SpaceModel, SubtractModel} from "../../engine/models"
import {nothing, Nothing} from "../../engine/nothing"
import {SphereModel} from "../../engine/models/sphereModel"
import {Logger} from "../../engine/models/logger"

const sizeModel = Size.default
const sizeSubtract = Size.half
const subtractPosition = new Point(-.32, .32, -.32)

export function subtractSphereTestModelAkaDeathStar(segmentsMaster: number = 10, segmentsSubtract: number = 7, logger: Logger | Nothing = nothing) {
  const subtractModel = SphereModel.create(segmentsSubtract)
  const subtract = new SpaceModel(subtractModel, subtractPosition, sizeSubtract)

  const sphereModel = SphereModel.create(segmentsMaster)
  return SubtractModel.create(sphereModel, subtract, Point.null, sizeModel, logger)
}
