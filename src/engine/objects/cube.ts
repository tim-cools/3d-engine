import {CubeModel, Point, rotateX, rotateZ, Size, SpaceModel} from "../models"
import {ObjectStyle} from "./object"
import {ModelObject} from "./modelObject"
import {Colors} from "../colors"

export class Cube extends ModelObject {

  constructor(id: string, position: Point, size: Size, style: ObjectStyle = ObjectStyle.Wireframe) {
    super(id, Colors.primary.darker, Cube.createModel(position, size, style))
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

  private static createModel(position: Point, size: any, style: ObjectStyle) {
    const model = CubeModel.create(25)
    return new SpaceModel(model, position, size)
  }
}
