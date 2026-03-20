import {Scene} from "./scenes"
import {CubeModel, Point, Size, SpaceModel} from "../models"
import {Object} from "../objects"
import {Lazy} from "../../infrastructure/lazy"
import {SubtractModelObject} from "../objects/subtractModelObject"
import {SubtractModels} from "../intersections/subtractModels"

export function subtractCubeTest(): Scene {

  const sizeSquare = Size.single(100)
  const subtractPosition = new Point(50, 50, 50)
  const square = CubeModel.create(4, Point.null, Point.single(100))
  const subtractSquare = new SpaceModel(CubeModel.create(4), subtractPosition, sizeSquare)

  const size = Size.single(0.005)
  const position = Point.single(-.25)

  return new Scene("subtract cube test", new Lazy<Object[]>(() => [
    new SubtractModelObject("test", new SubtractModels(square, subtractSquare), position, size),
  ]))
}
