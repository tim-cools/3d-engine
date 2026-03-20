import {Point} from "./primitives"

export const tolerance = 1E-3

export function equalsTolerance(value1: number, value2: number) {
  let difference = Math.abs(value1 - value2)
  return difference <= tolerance
}

export function betweenTolerance(value: number, loweBoundInclusive: number, upperBoundInclusive: number) {
  return (value - loweBoundInclusive) >= -tolerance && (value - upperBoundInclusive) <= tolerance
}

export function equalsTolerancePoint(point1: Point, point2: Point) {
  return equalsTolerance(point1.x, point2.x)
      && equalsTolerance(point1.y, point2.y)
      && equalsTolerance(point1.z, point2.z)
}

export function smallerTolerance(value1: number, value2: number): boolean {
  return (value1 - value2) < -tolerance
}

export function greaterTolerance(value1: number, value2: number): boolean {
  return (value1 - value2) > tolerance
}

