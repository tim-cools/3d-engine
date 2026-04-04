import {ApplicationContext} from "../applicationContext"
import {Scene} from "./scene"
import {CubeObject} from "../objects/cubeObject"

export function cube() {

  return new Scene("Cube", (context: ApplicationContext) => {

    function cube() {
      return new CubeObject(context, "cube")
    }

    return [
      cube(),
    ]
  })
}
