import {Boundaries, Space, Space2D, Transformer} from "../models"
import {View2D} from "../view"

export interface UpdatableShape extends Shape {
  update(transformers: readonly Transformer[]): void
}

export interface Shape2D {
  readonly id: string;
  render(space: Space2D, view: View2D, context: CanvasRenderingContext2D): void
}

export interface Shape {
  readonly id: string;
  render(space: Space, view: View2D, context: CanvasRenderingContext2D): void
  boundaries(space: Space): Boundaries
}
