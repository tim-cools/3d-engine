import {Scene} from "./scenes"
import {subtractSphereTestModelAkaDeathStar} from "../../tests/operations/subtractSphereTestModelAkaDeathStar"
import {Object, ModelObject} from "../objects"
import {Lazy} from "../../infrastructure/lazy"

export function subtractSphere(): Scene {

  function subtractSphere() {
    const model = subtractSphereTestModelAkaDeathStar(10, 7)
    return new ModelObject("subtract", model)
  }

  return new Scene("subtract sphere", new Lazy<Object[]>(() => [
    subtractSphere()
  ]))
}
