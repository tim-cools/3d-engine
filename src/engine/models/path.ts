import {Point, Segment} from "./primitives"
import {nothing} from "../../infrastructure/nothing"
import {Triangle} from "./triangle"
import {Space} from "./transformations"
import {FaceType} from "./faceType"
import {pushMany} from "../../infrastructure"
import {intersectionTriangleSegment, IntersectionType} from "../intersections"
import {ValuesCache} from "../../infrastructure/valuesCache"
import {Finite} from "./finite"
import {ModelType} from "./modelType"
import {nextPrimitiveId, PrimitiveType} from "./primitiveType"
import {PathSegment} from "./pathSegment"

export class Path implements Finite {

  private readonly cache: ValuesCache = new ValuesCache()
  private readonly segmentsValue: PathSegment[]

  readonly id = nextPrimitiveId()
  readonly primitiveType: PrimitiveType = PrimitiveType.Path
  readonly faceType = FaceType.Polygon
  readonly type: ModelType
  readonly debug: boolean = false
  readonly points: readonly Point[]

  get segments(): readonly PathSegment[] {
    return this.segmentsValue
  }

  get triangles(): readonly Triangle[] {
    return this.cache.get("triangles", () => this.getTriangles())
  }

  constructor(segments: PathSegment[], type: ModelType = ModelType.Primary, debug: boolean = false) {
    this.type = type
    this.debug = debug
    this.segmentsValue = segments
    this.points = Path.checkPoints(segments)
  }

  pointLocation(point: Point): number {
    throw new Error("Not yet implemented")
  }

  toSpace(space: Space) {
    const translated = this.segments.map(segment => segment.translate(space))
    return new Path(translated, this.type, this.debug)
  }

  private static checkPoints(segments: PathSegment[]): Point[] {
    const first = segments[0].begin
    let last = first
    const result: Point[] = [last]
    for (const segment of segments) {
      if (!last.equals(segment.begin)) {
        throw new Error("Segment 'begin' does not match previous 'end'")
      }
      last = segment.end
      result.push(last)
    }
    if (segments.length > 1 && !last.equals(first)) {
      throw new Error("First segment 'begin' does not match last segment 'end'")
    }
    return result
  }

  private getTriangles(): readonly Triangle[] {
    const triangles: Triangle[] = []
    let found = false
    for (let indexStart = 0; !found && indexStart < this.points.length; indexStart++) {
      const pointStart = this.points[indexStart]
      const result = this.checkTriangles(this.points, pointStart)
      if (result != nothing) {
        found = true
        pushMany(triangles, result)
      }
    }
    if (!found) {
      console.log("No valid triangles found")
      //throw new Error("No valid triangles found")
    }
    return triangles
  }

  private checkTriangles(points: readonly Point[], pointStart: Point) {
    const result: Triangle[] = []
    for (let index = 1; index < points.length; index++) {
      const point2 = points[index - 1]
      const point3 = points[index]

      if (!pointStart.equals(point2) && !pointStart.equals(point3)) {
        let triangle = new Triangle(pointStart, point2, point3, this.type)
        if (Path.overlapsOutside(points, triangle)) {
          return nothing;
        }
        result.push(triangle)
      }
    }
    return result
  }

  private static overlapsOutside(points: readonly Point[], triangle: Triangle): boolean {
    let start = points[0]
    for (let index = 1; index < points.length; index++){
      const point = points[index]
      const segment = new Segment(start, point)
      const intersection = intersectionTriangleSegment(triangle, segment)
      if (intersection.type == IntersectionType.Segment && !triangle.hasSegment(intersection.segment)) {
        return true
      }
      start = point;
    }
    return false
  }

  static fromPoints(points: readonly Point[]) {
    if (points.length == 0) return new Path([])
    const segments: PathSegment[] = []
    for (let index = 1; index < points.length; index++){
      const begin = points[index - 1]
      const end = points[index]
      segments.push(new PathSegment(begin, end))
    }
    segments.push(new PathSegment(points[points.length - 1], points[0]))
    return new Path(segments)
  }
}
