import {Scene} from "./scenes"
import {Point, Size, SpaceModel, SubtractModel} from "../models"
import {ModelObject} from "../objects/modelObject"
import {SphereModel} from "../models/sphereModel"

const sizeModel = Size.default
const sizeSubtract = Size.half
const subtractPosition = new Point(-.32, .32, -.32)
const segmentsNumber = 10
const sphereModel = SphereModel.create(segmentsNumber)

export function subtractSphere(): Scene {

  function subtractSphere() {

    const subtract = new SpaceModel(sphereModel, subtractPosition, sizeSubtract)
    const model = SubtractModel.create(sphereModel, subtract, Point.null, sizeModel)

    return new ModelObject("subtract", model)
  }

  return new Scene("subtract sphere", [
    subtractSphere()
  ])
}
