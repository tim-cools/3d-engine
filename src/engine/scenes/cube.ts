import {CubeModel, Point, Size, SpaceModel} from "../models"
import {Object} from "../objects"
import {Scene} from "./scenes"
import {Lazy} from "../../infrastructure/lazy"
import {SubtractModels} from "../intersections"
import {SubtractModelObject} from "../objects/subtractModelObject"

export function cube() {

  function cube() {
    const position = Point.middle.negate()
    const model = CubeModel.create(1)    //todo rendering >1 wth the SubtractSegments algorithm is not working yet
    const models = new SubtractModels(model, SpaceModel.empty)
    return new SubtractModelObject("cube", models, position, Size.default)
  }

  return new Scene("cube", new Lazy<Object[]>(() => [
    cube(),
  ]))
}
