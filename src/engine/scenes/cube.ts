import {CubeModel, Point, Size, SpaceModel} from "../models"
import {Scene} from "./scenes"
import {ModelObject} from "../objects/modelObject"

export function cube() {

  function cube() {
    const position = Point.middle.negate()
    const model = CubeModel.create(4)
    const spaceModel = new SpaceModel(model, position, Size.default)
    return new ModelObject("cube", spaceModel)
  }

  return new Scene("cube", [
    cube(),
  ])
}
