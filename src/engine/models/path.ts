import {Finite, ModelType, Point, Segment, SegmentBase} from "./primitives"
import {Nothing, nothing} from "../nothing"
import {Lazy} from "../../infrastructure/lazy"
import {Triangle} from "./triangle"
import {Space} from "./transformations"
import {FaceType} from "./faceType"
import {pushMany} from "../../infrastructure"
import {intersectionTriangleSegment, IntersectionType} from "../intersections"

class SegmentChainBuilder {

  private segmentsValue: PathSegment[]
  private segmentBegin: PathSegment
  private segmentEnd: PathSegment

  public get first(): PathSegment {
    if (this.segmentsValue.length == 0) {
      throw new Error("No segments.")
    }
    return this.segmentsValue[0]
  }

  public get segments(): readonly PathSegment[] {
    return this.segmentsValue
  }

  public get latest(): PathSegment {
    return this.segmentEnd
  }

  constructor(segment: PathSegment) {
    this.segmentBegin = segment
    this.segmentEnd = segment
    this.segmentsValue = [segment]
  }

  addConnected(segment: PathSegment) {
    const connecting = new PathSegment(this.segmentEnd.end, segment.begin)
    this.segmentsValue.push(connecting)

    this.segmentEnd = segment
    this.segmentsValue.push(this.segmentEnd)
  }

  connect(segment: PathSegment) {
    const connectionEnd = this.segmentEnd.normalizeEndConnection(segment)
    if (connectionEnd != nothing) {
      this.insertSegment(connectionEnd.begin, connectionEnd.segment)
      this.segmentEnd = connectionEnd.segment
      return true
    }
    const connectionBegin = this.segmentBegin.normalizeBeginConnection(segment)
    if (connectionBegin != nothing) {
      this.insertSegment(connectionBegin.begin, connectionBegin.segment)
      this.segmentBegin = connectionBegin.segment
      return true
    }
    return false
  }

  close() {

    const first = this.segments[0]
    const last = this.segments[this.segments.length - 1]

    if (last.end.equals(first.begin)) {
      return this.segments
    }

    this.segmentsValue.push(new PathSegment(last.end, first.begin))
  }

  single() {
    return this.segments.length == 1
  }

  build(): PathSegment[] {
    return this.segmentsValue
  }

  private insertSegment(begin: boolean, segment: PathSegment) {
    if (begin) {
      this.segmentsValue = [segment, ...this.segmentsValue]
    } else {
      this.segmentsValue.push(segment)
    }
  }
}

export class PathBuilder {

  private readonly segmentsValue: PathSegment[] = []
  private readonly type: ModelType
  private readonly debug: boolean

  constructor(type: ModelType = ModelType.Primary, debug: boolean = false) {
    this.type = type
    this.debug = debug
  }

  addSegment(begin: Point, end: Point) {
    this.segmentsValue.push(new PathSegment(begin, end))
  }

  closePaths(): Path[] | Nothing {
    if (this.segmentsValue.length == 0) return nothing
    if (this.segmentsValue.length == 1) return [new Path(this.segmentsValue, this.type, this.debug)]

    const remaining: PathSegment[] = [...this.segmentsValue]
    let chains: SegmentChainBuilder[] = []

    while (remaining.length > 0) {
      chains.push(PathBuilder.nextChain(remaining))
    }

    chains = this.combineSingles(chains)

    for (const chain of chains) {
      chain.close()
    }

    return chains.map(chain => new Path(chain.build(), this.type, this.debug))
  }

  private static nextChain(remaining: PathSegment[]): SegmentChainBuilder {

    const nextSegment = remaining[0]
    remaining.splice(0, 1)
    const chain = new SegmentChainBuilder(nextSegment)

    let segmentAdded = true
    while (segmentAdded && remaining.length > 0) {
      segmentAdded = false
      let index = 0
      while (index < remaining.length) {
        const pathSegment = remaining[index]
        if (chain.connect(pathSegment)) {
          remaining.splice(index, 1)
          segmentAdded = true
        } else {
          index++
        }
      }
    }

    return chain
  }

  private combineSingles(chains: SegmentChainBuilder[]) {

    const singles: SegmentChainBuilder[] = []
    const polyglots: SegmentChainBuilder[] = []

    for (const chain of chains) {
      if (chain.single()) {
        singles.push(chain)
      } else {
        polyglots.push(chain)
      }
    }

    if (singles.length <= 1) return chains

    const combined = new SegmentChainBuilder(singles[0].first)
    singles.splice(0, 1)

    while (singles.length > 0) {
      const closest = this.popClosest(combined.latest, singles)
      combined.addConnected(closest)
    }

    return [...polyglots, combined]
  }

  private popClosest(latest: PathSegment, singles: SegmentChainBuilder[]): PathSegment {
    let closest = PathBuilder.closestDistance(latest, 0, singles[0].first)
    for (let index = 1; index < singles.length; index++){
      const segmentClosest = PathBuilder.closestDistance(latest, index, singles[index].first)
      if (segmentClosest.distance < closest.distance) {
        closest = segmentClosest
      }
    }
    singles.splice(closest.index, 1)
    if (closest.begin) {
      return closest.segment
    } else {
      return new PathSegment(closest.segment.end, closest.segment.begin)
    }
  }

  private static closestDistance(latest: PathSegment, index: number, segment: PathSegment) {
    const distanceBegin = latest.end.distanceToPoint(segment.begin)
    const distanceEnd = latest.end.distanceToPoint(segment.end)
    return distanceBegin < distanceEnd
      ? {begin: true, distance: distanceBegin, index: index, segment: segment}
      : {begin: false, distance: distanceEnd, index: index, segment: segment}
  }
}

export class PathSegment implements SegmentBase {

  readonly begin: Point
  readonly end: Point

  constructor(begin: Point, end: Point) {
    this.begin = begin
    this.end = end
  }

  toString() {
    return `begin ${this.begin} end: ${this.end}`
  }

  normalizeBeginConnection(segment: PathSegment) {
    if (this.begin.equals(segment.end)) {
      return {begin: true, segment: segment}
    } else if (this.begin.equals(segment.begin)) {
      return {begin: true, segment: new PathSegment(segment.end, segment.begin)}
    } else {
      return nothing
    }
  }

  normalizeEndConnection(segment: PathSegment) {
    if (this.end.equals(segment.end)) {
      return {begin: false, segment: new PathSegment(segment.end, segment.begin)}
    } else if (this.end.equals(segment.begin)) {
      return {begin: false, segment: segment}
    } else {
      return nothing
    }
  }

  translate(space: Space) {
      const begin = space.translate(this.begin)
      const end = space.translate(this.end)
      return new PathSegment(begin, end)
  }

  equals(segment: SegmentBase) {
    return (this.begin.equals(segment.begin) && this.end.equals(segment.end))
        || (this.begin.equals(segment.end) && this.end.equals(segment.begin))
  }
}

export class Path implements Finite {

  private trianglesLazy: Lazy<readonly Triangle[]> = new Lazy<readonly Triangle[]>(() => this.getTriangles())
  private segmentsValue: PathSegment[]

  readonly points: readonly Point[]
  readonly faceType = FaceType.Polygon
  readonly type: ModelType
  readonly debug: boolean = false

  get segments(): readonly PathSegment[] {
    return this.segmentsValue
  }

  get triangles(): readonly Triangle[] {
    return this.trianglesLazy.value
  }

  constructor(segments: PathSegment[], type: ModelType = ModelType.Primary, debug: boolean = false) {
    this.type = type
    this.debug = debug
    this.segmentsValue = segments
    this.points = Path.checkPoints(segments)
  }

  pointLocation(point: Point): number {
    return 0;
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
        result.push(  triangle)
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
      if (intersection.type == IntersectionType.Segment && !triangle.containsSegment(intersection.segment)) {
        return true
      }
      start = point;
    }
    return false
  }
}
