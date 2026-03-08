import {PointShape, Shape} from "../shapes"
import {Colors} from "../colors"
import {Point, Size} from "../models"
import {BaseObject3D} from "./object"

export class Raster extends BaseObject3D {

  private readonly size: number
  private readonly step: number
  private readonly shapesValue: readonly Shape[]

  constructor(id: string, size: number, step: number) {
    super(id, Point.null, Size.default)
    this.size = size
    this.step = step
    this.shapesValue = this.createShapes()
  }

  createShapes(): readonly Shape[] {
    const half = this.size / 2
    const result: Shape[] = []
    for (let x = -half; x <= half; x += this.step) {
      for (let y = -half; y <= half; y += this.step) {
        for (let z = -half; z <= half; z += this.step) {
          const position = new Point(x, y, z)
          const pointShape = new PointShape(`${this.id}.point.${x}.${y}.${z}`, Colors.darkGray, position, 2)
          result.push(pointShape)
        }
      }
    }
    return result
  }

  shapes(): readonly Shape[] {
    return this.shapesValue
  }

  update(timeMilliseconds: number): void {
  }
}
