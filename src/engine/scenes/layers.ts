import {Colors} from "../../infrastructure/colors"
import {Point, Size} from "../models"
import {Rectangle} from "../objects"
import {ApplicationContext} from "../applicationContext"
import {RenderStyle} from "../state"
import {Scene} from "./scene"

export function layers(): Scene {

  function rectangle(color: string, z: number) {
    const position = new Point(0, 0, z)
    return new Rectangle("rectangle." + z, color, position, new Size(.5, .5, .5), RenderStyle.Solid)
  }

  return new Scene("Layers", (context: ApplicationContext) => [
    rectangle(Colors.primary.middle, -.5),
    rectangle(Colors.primary.middle, -.25),
    rectangle(Colors.primary.middle, 0),
    rectangle(Colors.primary.middle, .25),
    rectangle(Colors.primary.middle, .5)
  ])
}
