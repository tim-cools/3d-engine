import {Point} from "./primitives"
import {hashCode} from "../../infrastructure/stringFunctions"

export function hashCodePoints(points: readonly Point[]): number {
  const parts = points.map(point => point.toString())
  parts.sort((value1: string, value2: string) => value1 < value2 ? -1 : 1)
  const key = parts.join('|')
  return hashCode(key)
}
