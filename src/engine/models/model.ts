import {Point, Segment} from "./primitives"
import {Boundaries} from "./boundaries"
import {Face} from "./face"
import {Lazy} from "../../infrastructure/lazy"

export interface CanContainPoint {
  contains(coordinate: Point): boolean
}

export class Model implements CanContainPoint {

  private boundaryLazy: Lazy<Boundaries> = new Lazy<Boundaries>(() => this.createBoundaries())

  readonly segments: readonly Segment[]
  readonly faces: readonly Face[]

  get boundaries(): Boundaries {
    return this.boundaryLazy.value
  }

  //exposed as functions so they can be combined in composite objects without the need to
  //hold references to the whole original objects. This is used when subtracting segments
  readonly containsFunction: (coordinate: Point) => boolean
  readonly onBoundaryFunction: (coordinate: Point) => boolean

  constructor(segments: readonly Segment[],
              faces: readonly Face[],
              contains: (coordinate: Point) => boolean,
              onBoundary: (coordinate: Point) => boolean) {
    this.segments = segments
    this.faces = faces
    this.containsFunction = contains
    this.onBoundaryFunction = onBoundary
  }

  contains(point: Point): boolean {
    return this.containsFunction(point)
  }

  onBoundary(point: Point) {
    return this.onBoundaryFunction(point)
  }

  private createBoundaries(): Boundaries {
    const boundaries = Boundaries.fromIterator(this.segments, (segment, pointHandler) => {
      pointHandler(segment.begin)
      pointHandler(segment.end)
    })
    return boundaries
  }
}
