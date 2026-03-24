import {CubeModel, Point, Size, SpaceModel} from "../models"
import {Scene} from "./scenes"
import {SubtractModels} from "../intersections"
import {SubtractModelObject} from "../objects/subtractModelObject"
import {SceneContext} from "./sceneContext"

export function cube() {

  return new Scene("cube", (context: SceneContext) => {

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
