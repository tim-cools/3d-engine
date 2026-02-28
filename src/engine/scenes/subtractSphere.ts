import {axis, Scene} from "./scenes"
import {CubeModel, Point, Size, SpaceModel, SubtractModel} from "../models"
import {ModelObject} from "../objects/modelObject"
import {Colors} from "../colors"
import {SphereModel} from "../models/sphereModel"

const sizeModel = Size.default
const sizeSubtract = Size.half
const subtractPosition = new Point(-.32, .32, -.32)
const segmentsNumber = 9
const sphereModel = SphereModel.create(segmentsNumber)

export function subtractSphere(): Scene {

  function subtractSphere() {

    const subtract = new SpaceModel(sphereModel, subtractPosition, sizeSubtract)
    const model = SubtractModel.create(sphereModel, subtract, Point.null, sizeModel)

    return new ModelObject("subtract", Colors.primary.darker, model)
  }

  function ghostSphere() {
    const subtract = new SpaceModel(SphereModel.create(segmentsNumber), subtractPosition.multiplySize(sizeModel), sizeSubtract.multiply(sizeModel))
    return new ModelObject("ghost", Colors.primary.light, subtract)
  }

  return new Scene("subtract sphere", [
    axis(),
    subtractSphere(),
    ghostSphere()
  ])
}
