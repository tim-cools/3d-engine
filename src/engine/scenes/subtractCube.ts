import {Scene} from "./scenes"
import {CubeModel, Point, Size, SpaceModel} from "../models"
import {SubtractModelObject} from "../objects/subtractModelObject"
import {SubtractModels} from "../intersections"
import {SceneContext} from "./sceneContext"

export function subtractCube(): Scene {

  return new Scene("subtract cube", (context: SceneContext) => {

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
