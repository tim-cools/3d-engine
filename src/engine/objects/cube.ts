import {CubeModel, Point, Size, SpaceModel} from "../models"
import {ModelObject} from "./modelObject"
import {RenderStyle} from "../state/renderStyle"
import {SceneContext} from "../scenes/sceneContext"

export class Cube extends ModelObject {

  constructor(context: SceneContext, id: string, position: Point, size: Size, style: RenderStyle = RenderStyle.Wireframe) {
    super(context, id, Cube.createModel(position, size, style))
  }

  private static createModel(position: Point, size: any, style: RenderStyle) {
    const model = CubeModel.create(4)
    return new SpaceModel(model, position, size)
  }
}
