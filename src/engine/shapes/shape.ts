import {Boundaries, Space, Space2D, Transformer} from "../models"
import {View2D} from "../view"
import {Selectable} from "./selectable"

export interface UpdatableShape extends Shape {
  update(transformers: readonly Transformer[]): void
}

export class RenderShape2DContext {

  private readonly selectables: Selectable[]

  readonly space: Space2D
  readonly view: View2D
  readonly canvas: CanvasRenderingContext2D

  constructor(space: Space2D, view: View2D, selectables: Selectable[], canvas: CanvasRenderingContext2D) {
    this.space = space
    this.view = view
    this.canvas = canvas
    this.selectables = selectables
  }

  rendered(selectable: Selectable): void {
    this.selectables.push(selectable)
  }
}

export interface Shape2D {
  readonly id: string
  render(context: RenderShape2DContext): void
}

export class RenderShapeContext {

  private readonly selectables: Selectable[]

  readonly space: Space
  readonly view: View2D
  readonly canvas: CanvasRenderingContext2D

  constructor(space: Space, view: View2D, selectables: Selectable[], canvas: CanvasRenderingContext2D) {
    this.space = space
    this.view = view
    this.canvas = canvas
    this.selectables = selectables
  }

  rendered(selectable: Selectable): void {
    this.selectables.push(selectable)
  }
}

export interface Shape {
  readonly id: string
  render(context: RenderShapeContext): void
  boundaries(space: Space): Boundaries
}
