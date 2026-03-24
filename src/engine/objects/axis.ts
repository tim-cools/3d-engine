import {AxisModel} from "../models/axisModel"
import {Boundaries, Model, Point, Size} from "../models"
import {Object3DBase} from "./object"
import {LineShape, Shape} from "../shapes"

class AxisObject extends Object3DBase {

  private readonly model: Model

  protected shapesValue: readonly Shape[]

  protected get boundaries(): Boundaries {
    return this.model.boundaries
  }

  constructor(id: string,) {
    super(id, Point.null, Size.default)
    this.model = AxisModel.create()
    this.shapesValue = this.wireframe()
  }

  shapes(): readonly Shape[] {
    return this.shapesValue
  }

  private wireframe() {
    const result: Shape[] = []
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
