import {axis, Scene} from "./scenes"
import {CubeModel, Point, Size, SpaceModel, SubtractModel} from "../models"
import {ModelObject} from "../objects/modelObject"
import {Colors} from "../colors"
import {SphereModel} from "../models/sphereModel"

export function subtractCube(): Scene {

  function subtractCube() {
    const subtractPosition = new Point(.5, .5, .5)
    const master = CubeModel.create(4)
    const subtract = new SpaceModel(CubeModel.create(4), subtractPosition, Size.default)

    const size = new Size(.5, .5, .5)
    const position = size.half().negate()
    const model = SubtractModel.create(master, subtract, position, size)
    return new ModelObject("subtract", Colors.primary.darker, model)
  }

  function ghostCube() {
    const subtractPosition = new Point(.05, 0, 0)
    const subtract = new SpaceModel(CubeModel.create(4), subtractPosition, Size.default)
    return new ModelObject("ghost", Colors.primary.light, subtract)
  }

  return new Scene("subtract cube", [
    axis(),
    subtractCube(),
    ghostCube()
  ])
}
