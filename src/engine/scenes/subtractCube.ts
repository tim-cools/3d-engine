import {Scene} from "./scenes"
import {CubeModel, Point, Size, SpaceModel, SubtractModels} from "../models"
import {Object} from "../objects"
import {Lazy} from "../../infrastructure/lazy"
import {SubtractModelObject} from "../objects/subtractModelObject"

export function subtractCube(): Scene {

  function subtractCube() {
    const subtractPosition = new Point(.5, .5, .5)
    const master = CubeModel.create(1)
    const subtract = new SpaceModel(CubeModel.create(4), subtractPosition, Size.default)

    const size = new Size(.5, .5, .5)
    const position = size.half().negate()
    return new SubtractModelObject("subtract", new SubtractModels(master, subtract), position, size)
  }

  return new Scene("subtract cube", new Lazy<Object[]>(() => [
    subtractCube()
  ]))
}
