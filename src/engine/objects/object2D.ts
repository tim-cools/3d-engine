import {Shape2D} from "../shapes"
import {ObjectProperties} from "./objectProperties"

export interface Object2D {

  readonly is3D: false
  readonly id: string
  readonly properties: ObjectProperties

  readonly shapes: readonly Shape2D[]
}

export abstract class Object2DBase {

  private shapesValue: readonly Shape2D[] = []

  readonly is3D = false
  readonly id: string
  readonly properties: ObjectProperties

  get shapes(): readonly Shape2D[] {
    return this.shapesValue
  }

  protected constructor(id: string) {
    this.id = id
    this.properties = new ObjectProperties()
  }

  protected setShapes(shapes: readonly Shape2D[]) {
    this.shapesValue = shapes
  }
}
