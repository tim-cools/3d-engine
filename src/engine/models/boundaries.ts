import {Point} from "./primitives"
import {nothing, Nothing} from "../../infrastructure/nothing"
import {betweenTolerance, equalsTolerance} from "./equals"
import {Lazy} from "../../infrastructure/lazy"
import {Space} from "./transformations"

interface HandlerState {
  min: Point
  max: Point
  maxZ: Point
  averageZ: Point
  counter: number
}

export class Boundaries {

  private middleLazy = new Lazy<Point>(() => this.getMiddle())

  readonly min: Point
  readonly max: Point
  readonly maxZ: Point
  readonly averageZ: Point

  get leftBottomFront(): Point {
    return new Point(this.min.x, this.min.y, this.min.z)
  }

  get leftTopFront(): Point {
    return new Point(this.min.x, this.max.y, this.min.z)
  }

  get rightBottomFront(): Point {
    return new Point(this.max.x, this.min.y, this.min.z)
  }

  get rightTopFront(): Point {
    return new Point(this.max.x, this.max.y, this.min.z)
  }

  get leftBottomBack(): Point {
    return new Point(this.min.x, this.min.y, this.max.z)
  }

  get rightBottomBack(): Point {
    return new Point(this.max.x, this.min.y, this.max.z)
  }

  get leftTopBack(): Point {
    return new Point(this.min.x, this.max.y, this.max.z)
  }

  get rightTopBack(): Point {
    return new Point(this.max.x, this.max.y, this.max.z)
  }

  get middle(): Point {
    return this.middleLazy.value
  }

  private constructor(min: Point, max: Point, maxZ: Point, averageZ: Point) {
    this.min = min
    this.max = max
    this.maxZ = maxZ
    this.averageZ = averageZ
  }

  static fromItems(...points: Point[]): Boundaries {
    return this.fromIterator(points, (value, handler) => handler(value))
  }

  static fromArray(points: readonly Point[]) {
    return this.fromIterator(points, (value, handler) => handler(value))
  }

  static fromIterator<TItem>(iterator: readonly TItem[], handler: (item: TItem, pointHandler: (point: Point) => void) => void) {

    let state: HandlerState | Nothing = nothing

    function pointHandler(point: Point) {
      if (state == nothing) {
        state = {min: point, max: point, maxZ: point, averageZ: point, counter: 1 }
      } else {
        state.min = Point.min(state.min, point)
        state.max = Point.max(state.max, point)
        if (point.z > state.maxZ.z) {
          state.maxZ = point
        }
        state.averageZ = state.averageZ.add(point)
        state.counter += 1
      }
    }

    for (const item of iterator) {
      handler(item, pointHandler)
    }

    const stateValue: HandlerState | Nothing = state == nothing ? nothing : state as HandlerState
    return stateValue == nothing
      ? new Boundaries(Point.null, Point.null, Point.null, Point.null)
      : new Boundaries(stateValue.min, stateValue.max, stateValue.maxZ, stateValue.averageZ.divide(stateValue.counter))
  }

  toString() {
    return "min: " + this.min + " - max: " + this.max
  }

  toSpace(space: Space): Boundaries {
    const spaceMin = space.translate(this.min)
    const spaceMax = space.translate(this.max)
    const spaceMaxZ = space.translate(this.maxZ)
    const spaceAverageZ = space.translate(this.averageZ)
    return new Boundaries(spaceMin, spaceMax, spaceMaxZ, spaceAverageZ)
  }

  contains(coordinate: Point) {
    return betweenTolerance(coordinate.x, this.min.x, this.max.x)
        && betweenTolerance(coordinate.y, this.min.y, this.max.y)
        && betweenTolerance(coordinate.z, this.min.z, this.max.z)
  }

  onBoundary(coordinate: Point) {
    return (equalsTolerance(coordinate.x, this.min.x) && betweenTolerance(coordinate.y, this.min.y, this.max.y) && betweenTolerance(coordinate.z, this.min.z, this.max.z))
        || (equalsTolerance(coordinate.x, this.max.x) && betweenTolerance(coordinate.y, this.min.y, this.max.y) && betweenTolerance(coordinate.z, this.min.z, this.max.z))

        || (equalsTolerance(coordinate.y, this.min.y) && betweenTolerance(coordinate.x, this.min.x, this.max.x) && betweenTolerance(coordinate.z, this.min.z, this.max.z))
        || (equalsTolerance(coordinate.y, this.max.y) && betweenTolerance(coordinate.x, this.min.x, this.max.x) && betweenTolerance(coordinate.z, this.min.z, this.max.z))

        || (equalsTolerance(coordinate.z, this.min.z) && betweenTolerance(coordinate.y, this.min.y, this.max.y) && betweenTolerance(coordinate.x, this.min.x, this.max.x))
        || (equalsTolerance(coordinate.z, this.max.z) && betweenTolerance(coordinate.y, this.min.y, this.max.y) && betweenTolerance(coordinate.x, this.min.x, this.max.x))
  }

  private getMiddle() {
    const xSize = this.max.x - this.min.x
    const ySize = this.max.y - this.min.y
    const zSize = this.max.z - this.min.z
    return new Point(this.min.x + xSize / 2, this.min.y + ySize / 2, this.min.z + zSize / 2)
  }
}
