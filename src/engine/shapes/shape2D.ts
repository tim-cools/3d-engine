import {Boundaries, Space, Space2D} from "../models"
import {View2D} from "../view"
import {Selectable} from "./selectable"

export const FrontShape2D = -999

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

  addSelectable(selectable: Selectable): void {
    this.selectables.push(selectable)
  }
}

export interface Shape2D {
  readonly z: number
  render(context: RenderShape2DContext): void
}
