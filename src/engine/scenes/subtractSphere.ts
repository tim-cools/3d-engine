import {Scene} from "./scenes"
import {ModelObject} from "../objects/modelObject"
import {subtractSphereTestModelAkaDeathStar} from "../../tests/operations/subtractSphereTestModelAkaDeathStar"

export function subtractSphere(): Scene {

  function subtractSphere() {
    const model = subtractSphereTestModelAkaDeathStar()
    return new ModelObject("subtract", model)
  }

  return new Scene("subtract sphere", [
    subtractSphere()
  ])
}
