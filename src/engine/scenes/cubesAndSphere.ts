import {Scene} from "./scenes"
import {Cube, Overlay, Raster, Sphere} from "../objects"
import {Point, Size} from "../models"
import {SceneContext} from "./sceneContext"
import {RenderStyle} from "../state/renderStyle"

export function cubesAndSphere(): Scene {
  return new Scene("cubes and sphere", (context: SceneContext) => [
    new Sphere("sphere", new Point(0, 0, 0), new Size(.5, .5, .5)),
    new Cube(context, "cube.0", new Point(.5, 0, 0), new Size(.2, .2, .2), RenderStyle.Solid),
    new Cube(context, "cube.1", new Point(-.5, 0, 0), new Size(.2, .2, .2)),
    new Cube(context, "cube.2", new Point(0, .5, 0), new Size(.2, .2, .2), RenderStyle.Solid),
    new Cube(context, "cube.3", new Point(0, -.5, 0), new Size(.2, .2, .2)),
    new Cube(context, "cube.4", new Point(0, 0, .5), new Size(.2, .2, .2)),
    new Cube(context, "cube.5", new Point(0, 0, -.5), new Size(.2, .2, .2)),
    new Overlay("overlay"),
    new Raster("raster", 1, .2)
  ])
}
