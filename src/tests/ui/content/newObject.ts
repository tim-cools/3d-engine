import {CubeModel, Point, Size, SpaceModel} from "../../../engine/models"
import {ApplicationContext} from "../../../engine/applicationContext"
import {ModelObject} from "../../../engine/objects"

export function newObject(id: string, context: ApplicationContext) {
  const cube = CubeModel.create(1)
  const spaceModel = new SpaceModel(cube, Point.null, Size.null)
  return new ModelObject(context, id, spaceModel)
}
