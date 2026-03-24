import {Point, Size, SpaceModel} from "../models"
import {Scene} from "./scenes"
import {SphereModel} from "../models/sphereModel"
import {SubtractModels} from "../intersections"
import {SubtractModelObject} from "../objects/subtractModelObject"
import {SceneContext} from "./sceneContext"

export function sphere() {

  return new Scene("sphere", (context: SceneContext) => {

    function cube() {
      const model = SphereModel.create(10)
      const models = new SubtractModels(model, SpaceModel.empty)
      return new SubtractModelObject(context, "sphere", models, Point.null, Size.default)
    }

    return [
      cube()
    ]
  })
}
