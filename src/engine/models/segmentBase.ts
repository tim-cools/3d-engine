import {Point} from "./primitives"

export interface SegmentBase {
  readonly begin: Point
  readonly end: Point

  equals(segment: SegmentBase): boolean
}
