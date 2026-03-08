import {Point, Size, SpaceModel} from "../models"
import {Scene} from "./scenes"
import {SphereModel} from "../models/sphereModel"
import {ModelObject} from "../objects/modelObject"

export function sphere() {

  function cube() {
    const position = Point.null
    const model = SphereModel.create(4)
    const spaceModel = new SpaceModel(model, position, Size.default)
    return new ModelObject("cube", spaceModel)
  }

  return new Scene("sphere", [
    cube()
  ])
}
