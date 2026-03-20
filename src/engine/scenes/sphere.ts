import {CubeModel, Point, Size, SpaceModel} from "../models"
import {Object, ModelObject} from "../objects"
import {Scene} from "./scenes"
import {SphereModel} from "../models/sphereModel"
import {Lazy} from "../../infrastructure/lazy"
import {SubtractModels} from "../intersections"
import {SubtractModelObject} from "../objects/subtractModelObject"

export function sphere() {

  function cube() {
    const model = SphereModel.create(10)
    const models = new SubtractModels(model, SpaceModel.empty)
    return new SubtractModelObject("sphere", models, Point.null, Size.default)
  }

  return new Scene("sphere", new Lazy<Object[]>(() => [
    cube()
  ]))
}
