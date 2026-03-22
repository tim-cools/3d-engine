import {Point} from "../models"
import {PointShape, Shape} from "../shapes"
import {Object3DBase} from "./object"

export class PointObject extends Object3DBase {

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
