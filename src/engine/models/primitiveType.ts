import {Point, Segment} from "./primitives"
import {Triangle} from "./triangle"
import {Path} from "./path"

export type PrimitiveId = number

let lastId = 0

export function nextPrimitiveId(): PrimitiveId {
  return lastId++
}

export enum PrimitiveType {
  Point,
  Segment,
  Triangle,
  Path
}

export type Primitive = Point | Segment | Triangle | Path
