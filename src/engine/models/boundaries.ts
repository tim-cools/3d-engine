import {Point} from "./basics"
import {nothing, Nothing} from "../nothing"

interface HandlerState {
  min: Point,
  max: Point,
  maxZPoint: Point
}

export class Boundaries {

  readonly min: Point
  readonly max: Point
  readonly maxZPoint: Point

  private constructor(min: Point, max: Point, maxZPoint: Point) {
    this.min = min
    this.max = max
    this.maxZPoint = maxZPoint
  }

  static fromItems(...points: Point[]): Boundaries {
    return this.fromIterator(points, (value, handler) => handler(value))
  }

  static fromArray(points: Point[]) {
    return this.fromIterator(points, (value, handler) => handler(value))
  }

  static fromIterator<TItem>(iterator: readonly TItem[], handler: (item: TItem, pointHandler: (point: Point) => void) => void) {

    let state: HandlerState | Nothing = nothing

    function pointHandler(point: Point) {
      if (state == nothing) {
        state = {
          min: point,
          max: point,
          maxZPoint: point
        }
      } else {
        state.min = Point.min(state.min, point)
        state.max = Point.max(state.max, point)
        if (point.z > state.maxZPoint.z) {
          state.maxZPoint = point
        }
      }
    }

    for (const item of iterator) {
      handler(item, pointHandler)
    }

    const stateValue: HandlerState | Nothing = state == nothing ? nothing : state as HandlerState
    return stateValue == nothing
      ? new Boundaries(Point.null, Point.null, Point.null)
      : new Boundaries(stateValue.min, stateValue.max, stateValue.maxZPoint)
  }

  toString() {
    return "min: " + this.min + " - max: " + this.max
  }
}
