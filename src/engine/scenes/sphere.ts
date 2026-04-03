import {Point, Size, SpaceModel} from "../models"
import {SphereModel} from "../models/sphereModel"
import {ApplicationContext} from "../applicationContext"
import {Scene} from "./scene"
import {ModelObject} from "../objects"

export function sphere() {

  return new Scene("Sphere", (context: ApplicationContext) => {

    function sphere() {
      const model = SphereModel.create(10)
      const spaceModel = new SpaceModel(model, Point.null, Size.default)
      return new ModelObject(context, "sphere", spaceModel)
    }

    return [
      sphere()
    ]
  })
}
