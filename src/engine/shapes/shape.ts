import {Boundaries, Space, Space2D} from "../models"
import {View2D} from "../view"
import {Selectable} from "./selectable"

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
  render(context: RenderShapeContext): void
  boundaries(space: Space): Boundaries
}
