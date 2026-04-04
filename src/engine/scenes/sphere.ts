import {ApplicationContext} from "../applicationContext"
import {Scene} from "./scene"
import {SphereObject} from "../objects/sphereObject"

export function sphere() {

  return new Scene("Sphere", (context: ApplicationContext) => {

    function sphere() {
      return new SphereObject(context, "sphere")
    }

    return [
      sphere()
    ]
  })
}
