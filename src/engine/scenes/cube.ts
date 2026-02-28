import {CubeModel, Point, Size, SpaceModel} from "../models"
import {Scene} from "./scenes"
import {AxisModel} from "../models/axisModel"
import {ModelObject} from "../objects/modelObject"
import {Colors} from "../colors"

export function cube() {

  function axis() {
    const model = AxisModel.create(Point.null, Size.default)
    const spaceModel = new SpaceModel(model, Point.null, Size.default)
    return new ModelObject("axis", Colors.gray.dark, spaceModel)
  }

  function cube() {
    const position = Point.middle.negate()
    const model = CubeModel.create(4)
    const spaceModel = new SpaceModel(model, position, Size.default)
    return new ModelObject("cube", Colors.primary.darker, spaceModel)
  }

  return new Scene("cube", [
    axis(),
    cube(),
  ])
}
