import {CubeModel, Point, rotateX, rotateZ, Size, SpaceModel} from "../models"
import {ModelObject} from "./modelObject"
import {RenderStyle} from "./renderStyle"

export class Cube extends ModelObject {

  constructor(id: string, position: Point, size: Size, style: RenderStyle = RenderStyle.Wireframe) {
    super(id, Cube.createModel(position, size, style))
  }

  update(timeMilliseconds: number): void {
    const offset = timeMilliseconds / 3600
    for (const shape of this.shapesValue) {
      shape.update([
        //rotateZ(offset),
        //rotateX(offset),
        //rotateY(offset),
      ])
    }
  }

  private static createModel(position: Point, size: any, style: RenderStyle) {
    const model = CubeModel.create(4)
    return new SpaceModel(model, position, size)
  }
}
