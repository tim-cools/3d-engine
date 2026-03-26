import {CubeModel, Point, Size, SpaceModel} from "../models"
import {SubtractModelObject} from "../objects/subtractModelObject"
import {SubtractModels} from "../intersections"
import {ApplicationContext} from "../applicationContext"
import {Scene} from "./scene"

export function subtractCube(): Scene {

  return new Scene("Subtract cube", (context: ApplicationContext) => {

    function subtractCube() {
      const subtractPosition = new Point(.5, .5, .5)
      const master = CubeModel.create(1)
      const subtract = new SpaceModel(CubeModel.create(4), subtractPosition, Size.default)

      const size = new Size(.5, .5, .5)
      const position = size.half().negate()
      return new SubtractModelObject(context, "subtract", new SubtractModels(master, subtract), position, size)
    }

    return [
      subtractCube()
    ]
  })
}
