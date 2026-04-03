import {Point} from "./primitives"

export interface Finite {
  pointLocation(point: Point): number
}
