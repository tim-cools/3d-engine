import {AxisModel} from "../models/axisModel"
import {Boundaries, Model, Point, Size} from "../models"
import {BaseObject3D} from "./object"
import {nothing, Nothing} from "../nothing"
import {LineShape, Shape, UpdatableShape} from "../shapes"

class AxisObject extends BaseObject3D {

  private readonly model: Model

  protected shapesValue: readonly UpdatableShape[]

  protected get boundaries(): Boundaries {
    return this.model.boundaries
  }

  constructor(id: string,) {
    super(id, Point.null, Size.default)
    this.model = AxisModel.create()
    this.shapesValue = this.wireframe()
  }

  update(timeMilliseconds: number): void {
  }

  shapes(): readonly Shape[] {
    return this.shapesValue
  }

  private wireframe() {
    const result: UpdatableShape[] = []
    for (let index = 0; index < this.model.segments.length; index++) {
      const segment = this.model.segments[index]
      if (!segment.debug) {
        result.push(LineShape.fromSegment(this.id + ".line." + index, segment, false))
      }
    }
    return result
  }
}

export function axis() {
  return new AxisObject("axis")
}
