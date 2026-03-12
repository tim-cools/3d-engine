import {Point, Size, SpaceModel, SubtractLogger, SubtractModel} from "../../engine/models"
import {nothing, Nothing} from "../../engine/nothing"
import {SphereModel} from "../../engine/models/sphereModel"

const sizeModel = Size.default
const sizeSubtract = Size.half
const subtractPosition = new Point(-.32, .32, -.32)

export function subtractSphereTestModelAkaDeathStar(logger: SubtractLogger | Nothing = nothing) {
  const subtractModel = SphereModel.create(25)
  const subtract = new SpaceModel(subtractModel, subtractPosition, sizeSubtract)

  const sphereModel = SphereModel.create(35)
  return SubtractModel.create(sphereModel, subtract, Point.null, sizeModel, logger)
}
