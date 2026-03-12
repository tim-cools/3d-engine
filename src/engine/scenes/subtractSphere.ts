import {Scene} from "./scenes"
import {ModelObject} from "../objects/modelObject"
import {subtractSphereTestModelAkaDeathStar} from "../../tests/operations/subtractSphereTestModelAkaDeathStar"

export function subtractSphere(): Scene {

  function subtractSphere() {
    const model = subtractSphereTestModelAkaDeathStar(10, 7)
    return new ModelObject("subtract", model)
  }

  return new Scene("subtract sphere", [
    subtractSphere()
  ])
}
