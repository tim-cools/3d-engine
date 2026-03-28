import {CubeModel, Point, Size, SpaceModel} from "../models"
import {ApplicationContext} from "../applicationContext"
import {Scene} from "./scene"
import {ModelObject} from "../objects"

export function cube() {

  return new Scene("Cube", (context: ApplicationContext) => {

    function cube() {
      const position = Point.middle.negate()
      const model = CubeModel.create(1)    //todo rendering >1 wth the SubtractSegments value is not working yet
      const spaceModel = new SpaceModel(model, position, Size.default)
      return new ModelObject(context, "cube", spaceModel)
    }

    return [
      cube(),
    ]
  })
}
