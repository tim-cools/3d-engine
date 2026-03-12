import {Point, Segment} from "./primitives"
import {Boundaries} from "./boundaries"
import {Face} from "./face"
import {Lazy} from "../../infrastructure/lazy"

export interface CanContainPoint {
  contains(coordinate: Point): boolean
}

export class Model implements CanContainPoint {

  private readonly middleLazy = new Lazy<Point>(() => this.calculateMiddle())
  private readonly boundaryLazy: Lazy<Boundaries> = new Lazy<Boundaries>(() => this.createBoundaries())

  readonly points: readonly Point[]
  readonly segments: readonly Segment[]
  readonly faces: readonly Face[]

  get middle(): Point {
    return this.middleLazy.value
  }

  get boundaries(): Boundaries {
    return this.boundaryLazy.value
  }

  //exposed as functions so they can be combined in composite objects without the need to
  //hold references to the whole original objects. This is used when subtracting segments
  readonly containsFunction: (coordinate: Point) => boolean
  readonly onBoundaryFunction: (coordinate: Point) => boolean

  constructor(points: readonly Point[],
              segments: readonly Segment[],
              faces: readonly Face[],
              contains: (coordinate: Point) => boolean,
              onBoundary: (coordinate: Point) => boolean) {
    this.points = points
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

  private calculateMiddle() {

    let x = 0
    let y = 0
    let z = 0
    let counter = 0

    function addPoint(point: Point) {
      x += point.x
      y += point.y
      z += point.z
      counter++
    }

    for (const face of this.faces) {
      for (const triangle of face.triangles) {
        addPoint(triangle.point1)
        addPoint(triangle.point2)
        addPoint(triangle.point3)
      }
    }

    return new Point(x / counter, y / counter, z / counter)
  }
}
