import {Scene} from "./scenes"
import {Cube, Object, ObjectStyle, Overlay, Raster, Sphere} from "../objects"
import {Point, Size} from "../models"
import {Lazy} from "../../infrastructure/lazy"

export function cubesAndSphere(): Scene {
  return new Scene("cubes and sphere", new Lazy<Object[]>(() => [
    new Sphere("sphere", new Point(0, 0, 0), new Size(.5, .5, .5)),
    new Cube("cube.0", new Point(.5, 0, 0), new Size(.2, .2, .2), ObjectStyle.Solid),
    new Cube("cube.1", new Point(-.5, 0, 0), new Size(.2, .2, .2)),
    new Cube("cube.2", new Point(0, .5, 0), new Size(.2, .2, .2), ObjectStyle.Solid),
    new Cube("cube.3", new Point(0, -.5, 0), new Size(.2, .2, .2)),
    new Cube("cube.4", new Point(0, 0, .5), new Size(.2, .2, .2)),
    new Cube("cube.5", new Point(0, 0, -.5), new Size(.2, .2, .2)),
    new Overlay("overlay"),
    new Raster("raster", 1, .2)
  ]))
}
