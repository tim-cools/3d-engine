import {CubeModel, Point, Size, SpaceModel} from "../models"
import {SubtractModels} from "../intersections"
import {SubtractModelObject} from "../objects/subtractModelObject"
import {ApplicationContext} from "../applicationContext"
import {Scene} from "./scene"

export function cube() {

  return new Scene("Cube", (context: ApplicationContext) => {

    function cube() {
      const position = Point.middle.negate()
      const model = CubeModel.create(1)    //todo rendering >1 wth the SubtractSegments value is not working yet
      const models = new SubtractModels(model, SpaceModel.empty)
      return new SubtractModelObject(context, "cube", models, position, Size.default)
    }

    return [
      cube(),
    ]
  })
}
