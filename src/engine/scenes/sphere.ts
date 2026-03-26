import {Point, Size, SpaceModel} from "../models"
import {SphereModel} from "../models/sphereModel"
import {SubtractModels} from "../intersections"
import {SubtractModelObject} from "../objects/subtractModelObject"
import {ApplicationContext} from "../applicationContext"
import {Scene} from "./scene"

export function sphere() {

  return new Scene("Sphere", (context: ApplicationContext) => {

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
