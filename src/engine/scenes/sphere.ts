import {Point, Size} from "../models"
import {Object, ModelObject} from "../objects"
import {Scene} from "./scenes"
import {SphereModel} from "../models/sphereModel"
import {Lazy} from "../../infrastructure/lazy"

export function sphere() {

  function cube() {
    const position = Point.null
    const model = SphereModel.createInSpace(33, position, Size.default)
    return new ModelObject("cube", model)
  }

  return new Scene("sphere", new Lazy<Object[]>(() => [
    cube()
  ]))
}
