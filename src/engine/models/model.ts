import {Point, Segment} from "./basics"
import {Triangle} from "./triangle"
import {Size} from "./size"
import {Boundaries} from "./boundaries"

export class Model {

  readonly segments: readonly Segment[]
  readonly triangles: readonly Triangle[]

  readonly containsFunction: (coordinate: Point) => boolean
  readonly onBoundaryFunction: (coordinate: Point) => boolean

  constructor(vertices: readonly Segment[],
              triangles: readonly Triangle[],
              contains: (coordinate: Point) => boolean,
              onBoundary: (coordinate: Point) => boolean) {
    this.segments = vertices
    this.triangles = triangles
    this.containsFunction = contains
    this.onBoundaryFunction = onBoundary
  }

  contains(point: Point): boolean {
    return this.containsFunction(point)
  }

  onBoundary(point: Point) {
    return this.onBoundaryFunction(point)
  }

  boundaries(): Boundaries {
    const boundaries = Boundaries.fromIterator(this.segments, (segment, pointHandler) => {
      pointHandler(segment.begin)
      pointHandler(segment.end)
    })
    return boundaries
  }
}
