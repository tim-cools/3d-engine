import {Point} from "../models"
import {PointShape, Shape} from "../shapes"
import {BaseObject3D} from "./object"

export class PointObject extends BaseObject3D {

  private readonly color: string

  constructor(id: string, color: string, position: Point) {
    super(id, position)
    this.color = color
  }

  shapes(): readonly Shape[] {
    const shape = new PointShape(this.id + ".point", this.color, this.position, 3)
    return [shape]
  }

  update(timeMilliseconds: number): void {
  }
}
