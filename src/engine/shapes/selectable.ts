import {Point2D, PrimitiveSource} from "../models"
import {SelectablePath} from "./selectablePath"
import {SelectableSegment} from "./selectableSegment"
import {SelectablePoint} from "./selectablePoint"

export enum SelectableState {
  None,
  Hover,
  Selected,
  Group
}

export type SelectableObject = SelectablePoint | SelectableSegment | SelectablePath

export interface Selectable {
  includes(point: Point2D): Boolean
  source: PrimitiveSource
}

export const SelectableMargin = 7

