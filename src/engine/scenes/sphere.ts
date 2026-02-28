import {Point, Size, SpaceModel} from "../models"
import {axis, Scene} from "./scenes"
import {SphereModel} from "../models/sphereModel"
import {ModelObject} from "../objects/modelObject"
import {Colors} from "../colors"

export function sphere() {

  function cube() {
    const position = Point.null
    const model = SphereModel.create(9)
    const spaceModel = new SpaceModel(model, position, Size.default)
    return new ModelObject("cube", Colors.primary.darker, spaceModel)
  }

  return new Scene("sphere", [
    axis(),
    cube(),
  ])
}
