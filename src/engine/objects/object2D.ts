import {Shape2D} from "../shapes"

export interface Object2D {

  readonly is3D: false
  readonly id: string

  readonly shapes: readonly Shape2D[]
}

export abstract class Object2DBase {

  private shapesValue: readonly Shape2D[] = []

  readonly is3D = false
  readonly id: string

  get shapes(): readonly Shape2D[] {
    return this.shapesValue
  }

  protected constructor(id: string) {
    this.id = id
  }

  protected setShapes(shapes: readonly Shape2D[]) {
    this.shapesValue = shapes
  }
}
