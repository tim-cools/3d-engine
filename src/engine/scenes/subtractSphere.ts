import {Scene} from "./scenes"
import {subtractSphereTestModelAkaDeathStar} from "../../tests/operations/subtractSphereTestModelAkaDeathStar"
import {Object} from "../objects"
import {Lazy} from "../../infrastructure/lazy"
import {SubtractModelObject} from "../objects/subtractModelObject"
import {Point, Size} from "../models"

export function subtractSphere(): Scene {

  function subtractSphere() {
    const models = subtractSphereTestModelAkaDeathStar(10, 7)
    return new SubtractModelObject("subtract", models, Point.null, Size.default)
  }

  return new Scene("subtract sphere", new Lazy<Object[]>(() => [
    subtractSphere()
  ]))
}
