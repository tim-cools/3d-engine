import {Point, Size, SubtractModels} from "../../engine/models"
import {SphereModel} from "../../engine/models/sphereModel"

const sizeSubtract = Size.half
const subtractPosition = new Point(-.32, .32, -.32)

export function subtractSphereTestModelAkaDeathStar(segmentsMaster: number = 10, segmentsSubtract: number = 7) {

  const subtract = SphereModel.createInSpace(segmentsSubtract, subtractPosition, sizeSubtract)
  const sphereModel = SphereModel.create(segmentsMaster)

  return new SubtractModels(sphereModel, subtract)
}
