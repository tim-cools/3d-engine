import {Scene} from "./scenes"
import {Colors} from "../colors"
import {Point, Size} from "../models"
import {ObjectStyle, Rectangle} from "../objects"

export function layers(): Scene {

  function rectangle(color: string, z: number) {
    const position = new Point(0, 0, z)
    return new Rectangle("rectangle." + z, color, position, new Size(.5, .5, .5), ObjectStyle.Solid)
  }

  return new Scene("layers", [
    rectangle(Colors.primary.middle, 0),
    rectangle(Colors.primary.darker, .25),
    rectangle(Colors.primary.dark, .5),
    rectangle(Colors.primary.lighter, -.25),
    rectangle(Colors.primary.light, -.5)
  ])
}
