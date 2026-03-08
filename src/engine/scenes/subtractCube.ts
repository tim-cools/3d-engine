import {Scene} from "./scenes"
import {CubeModel, Point, Size, SpaceModel, SubtractModel} from "../models"
import {ModelObject} from "../objects/modelObject"

export function subtractCube(): Scene {

  function subtractCube() {
    const subtractPosition = new Point(.5, .5, .5)
    const master = CubeModel.create(2)
    const subtract = new SpaceModel(CubeModel.create(4), subtractPosition, Size.default)

    const size = new Size(.5, .5, .5)
    const position = size.half().negate()
    const model = SubtractModel.create(master, subtract, position, size)
    return new ModelObject("subtract", model)
  }

  return new Scene("subtract cube", [
    subtractCube()
  ])
}
