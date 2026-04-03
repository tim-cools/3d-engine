import {ModelObject, Overlay, Raster} from "../objects"
import {CubeModel, Point, Size, SpaceModel} from "../models"
import {ApplicationContext} from "../applicationContext"
import {Scene} from "./scene"
import {SphereModel} from "../models/sphereModel"

export function cubesAndSphere(): Scene {

  function sphere(context: ApplicationContext, position: Point, size: Size) {
    const model = SphereModel.create(10)
    const spaceModel = new SpaceModel(model, position, size)
    return new ModelObject(context, "sphere", spaceModel)
  }

  function cube(context: ApplicationContext, index: number, position: Point, size: Size) {
    const model = CubeModel.create(4)    //todo rendering >1 wth the SubtractSegments value is not working yet
    const spaceModel = new SpaceModel(model, position, Size.default)
    return new ModelObject(context, "cube" + index, spaceModel)
  }

  return new Scene("Cubes and sphere", (context: ApplicationContext) => [
    sphere(context, new Point(0, 0, 0), new Size(.5, .5, .5)),
    cube(context, 0, new Point(.5, 0, 0), new Size(.2, .2, .2)),
    cube(context, 1, new Point(-.5, 0, 0), new Size(.2, .2, .2)),
    cube(context, 2, new Point(0, .5, 0), new Size(.2, .2, .2)),
    cube(context, 3, new Point(0, -.5, 0), new Size(.2, .2, .2)),
    cube(context, 4, new Point(0, 0, .5), new Size(.2, .2, .2)),
    cube(context, 5, new Point(0, 0, -.5), new Size(.2, .2, .2)),
    new Overlay("overlay"),
    new Raster("raster", 1, .2)
  ])
}
