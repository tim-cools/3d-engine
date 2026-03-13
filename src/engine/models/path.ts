import {Finite, ModelType, Point} from "./primitives"
import {Nothing, nothing} from "../nothing"
import {Lazy} from "../../infrastructure/lazy"
import {Triangle} from "./triangle"
import {Space} from "./transformations"
import {FaceType} from "./faceType"
import {pushMany} from "../../infrastructure"

class SegmentChain {

  private readonly segmentsValue: PathSegment[]

  get segments(): readonly PathSegment[] {
    return this.segmentsValue
  }

  readonly points: readonly Point[]

  constructor(segments: PathSegment[]) {
    this.segmentsValue = segments
    this.points = this.checkPoints(segments)
  }

  translate(space: Space): SegmentChain {
    return new SegmentChain(this.segmentsValue.map(segment => segment.translate(space)))
  }

  private checkPoints(segments: PathSegment[]): Point[] {
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
}

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

  build(): SegmentChain {
    return new SegmentChain(this.segmentsValue)
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

  private segmentsValue: PathSegment[] = []

  addSegment(begin: Point, end: Point) {
    this.segmentsValue.push(new PathSegment(begin, end))
  }

  closePath(): Path | Nothing {
    if (this.segmentsValue.length == 0) return nothing
    if (this.segmentsValue.length == 1) return new Path([new SegmentChain(this.segmentsValue)])

    const remaining: PathSegment[] = [...this.segmentsValue]
    let chains: SegmentChainBuilder[] = []

    while (remaining.length > 0) {
      chains.push(PathBuilder.nextChain(remaining))
    }

    chains = this.combineSingles(chains)

    for (const chain of chains) {
      chain.close()
    }

    return new Path(chains.map(chain => chain.build()))
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
    let closest = this.closestDistance(latest, 0, singles[0].first)
    for (let index = 1; index < singles.length; index++){
      const segmentClosest = this.closestDistance(latest, index, singles[index].first)
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

  private closestDistance(latest: PathSegment, index: number, segment: PathSegment) {
    const distanceBegin = latest.end.distanceToPoint(segment.begin)
    const distanceEnd = latest.end.distanceToPoint(segment.end)
    return distanceBegin < distanceEnd
      ? {begin: true, distance: distanceBegin, index: index, segment: segment}
      : {begin: false, distance: distanceEnd, index: index, segment: segment}
  }
}

export class PathSegment {

  readonly begin: Point
  readonly end: Point

  constructor(begin: Point, end: Point) {
    this.begin = begin
    this.end = end
  }

  toString() {
    return `begin ${this.begin} end: ${this.end}`
  }

  connectsWith(segment: PathSegment) {
    return this.end.equals(segment.end) || this.end.equals(segment.begin)
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
}

export class Path implements Finite {

  private segmentsLazy: Lazy<readonly PathSegment[]> = new Lazy<readonly PathSegment[]>(() => this.getSegments())
  private trianglesLazy: Lazy<readonly Triangle[]> = new Lazy<readonly Triangle[]>(() => this.getTriangles())

  readonly faceType = FaceType.Polygon
  readonly type = ModelType.Primary
  readonly debug: boolean = false
  readonly chains: readonly SegmentChain[]

  get triangles(): readonly Triangle[] {
    return this.trianglesLazy.value
  }

  get segments(): readonly PathSegment[] {
    return this.segmentsLazy.value
  }

  constructor(chains: readonly SegmentChain[], type: ModelType = ModelType.Primary, debug: boolean = false) {
    this.chains = chains
    this.type = ModelType.Primary
    this.debug = debug
  }

  pointLocation(point: Point): number {
    return 0;
  }

  toSpace(space: Space) {
    const translated = this.chains.map(chain => chain.translate(space))
    return new Path(translated, this.type, this.debug)
  }

  private getSegments(): readonly PathSegment[] {
    const result: PathSegment[] = []
    this.chains.forEach(chain => pushMany(result, chain.segments))
    return result
  }

  private getTriangles(): readonly Triangle[] {
    return []
  }
    /*if (this.points.length == 0) return []
    for (let indexStart = 0; indexStart < this.points.length; indexStart ++) {
      const pointStart = this.points[indexStart]
      const result = this.checkTriangles(pointStart)
      if (result != nothing) {
        return result
      }
    }
    throw new Error("No valid triangles found")
  }

  private getSegments(): readonly Segment[] {
    const result: Segment[] = []
    const beginPoint = this.points[0]
    for (let index = 1; index < this.points.length; index++) {
      const endPoint = this.points[index]
      const segment = new Segment(beginPoint, endPoint)
      result.push(segment)
    }
    return result
  }

  private checkTriangles(pointStart: Point) {
    const result: Triangle[] = []
    for (let index = 1; index < this.points.length; index++) {
      const point2 = this.points[index - 1]
      const point3 = this.points[index]

      if (!pointStart.equals(point2) && !pointStart.equals(point3)) {
        let triangle = new Triangle(pointStart, point2, point3)
        if (this.overlapsOutside(triangle)) {
          return nothing;
        }
        result.push(  triangle)
      }
    }
    return result
  }

  private overlapsOutside(triangle: Triangle): boolean {
    let start = this.points[0]
    for (let index = 1; index < this.points.length; index++){
      const point = this.points[index]
      const segment = new Segment(start, point)
      const intersection = intersectionTriangleSegment(triangle, segment)
      if (intersection.type == IntersectionType.Segment && !triangle.containsSegment(intersection.segment)) {
        return true
      }
      start = point;
    }
    return false
  }
     */

}
