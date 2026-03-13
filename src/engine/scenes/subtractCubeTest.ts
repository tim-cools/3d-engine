import {Scene} from "./scenes"
import {CubeModel, Point, Size, SpaceModel, SubtractModel} from "../models"
import {ModelObject} from "../objects/modelObject"

export function subtractCubeTest(): Scene {

  const sizeSquare = Size.single(100)
  const subtractPosition = new Point(50, 50, 50)
  const square = CubeModel.create(4, Point.null, Point.single(100))
  const subtractSquare = new SpaceModel(CubeModel.create(4), subtractPosition, sizeSquare)

  const size = Size.single(0.005)
  const position = Point.single(-.25)
  const result = SubtractModel.create(square, subtractSquare)

  return new Scene("subtract cube test", [
    new ModelObject("test", new SpaceModel(result, position, size)),
  ])
}
