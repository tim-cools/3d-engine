import {Point, Size, SpaceModel} from "../models"
import {Object} from "../objects"
import {Scene} from "./scenes"
import {SphereModel} from "../models/sphereModel"
import {ModelObject} from "../objects/modelObject"
import {Lazy} from "../../infrastructure/lazy"

export function sphere() {

  function cube() {
    const position = Point.null
    const model = SphereModel.create(33)
    const spaceModel = new SpaceModel(model, position, Size.default)
    return new ModelObject("cube", spaceModel)
  }

  return new Scene("sphere", new Lazy<Object[]>(() => [
    cube()
  ]))
}
