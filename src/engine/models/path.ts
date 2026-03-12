import {Finite, ModelType, Point} from "./primitives"
import {nothing} from "../nothing"
import {Lazy} from "../../infrastructure/lazy"
import {pushMany} from "../../infrastructure"
import {Triangle} from "./triangle"
import {Space} from "./transformations"
import {FaceType} from "./faceType"

class SegmentChain {

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

    const beginConnection = this.segmentBegin.normalizeConnection(segment)
    if (beginConnection != nothing) {
      this.segmentBegin = beginConnection
      this.segmentsValue.push(this.segmentBegin)
      return true
    }

    const endConnection = this.segmentEnd.normalizeConnection(segment)
    if (endConnection != nothing) {
      this.segmentEnd = endConnection
      this.segmentsValue.push(this.segmentEnd)
      return true
    }

    return false
  }

  close() {
    if (this.segmentBegin.connectsWith(this.segmentEnd)) {
      return this.segments
    }

    const first = this.segments[0]
    const last = this.segments[this.segments.length - 1]

    return [...this.segments, new PathSegment(last.end, first.begin)]
  }

  single() {
    return this.segments.length == 1
  }
}

export class PathBuilder {

  private segmentsValue: PathSegment[] = []

  addSegment(begin: Point, end: Point) {
    this.segmentsValue.push(new PathSegment(begin, end))
  }

  closePath() {
    if (this.segmentsValue.length < 2) return new Path(this.segmentsValue)

    const remaining: PathSegment[] = [...this.segmentsValue]
    const newPath: PathSegment[] = []
    let chains: SegmentChain[] = []

    while (remaining.length > 0) {
      chains.push(PathBuilder.nextChain(remaining))
    }

    chains = this.combineSingles(chains)

    for (const chain of chains) {
      const chainSegments = chain.close()
      pushMany(newPath, chainSegments)
    }

    return new Path(newPath)
  }

  private static nextChain(remaining: PathSegment[]): SegmentChain {

    const nextSegment = remaining[0]
    remaining.splice(0, 1)
    const chain = new SegmentChain(nextSegment)

    let index = 0
    while (index < remaining.length){
      const pathSegment = remaining[index]
      if (chain.connect(pathSegment)) {
        remaining.splice(index, 1)
      } else {
        index++
      }
    }

    return chain
  }

  private combineSingles(chains: SegmentChain[]) {

    const singles: SegmentChain[] = []
    const polyglots: SegmentChain[] = []

    for (const chain of chains) {
      if (chain.single()) {
        singles.push(chain)
      } else {
        polyglots.push(chain)
      }
    }

    if (singles.length <= 1) return chains

    const combined = new SegmentChain(singles[0].first)
    singles.splice(0, 1)

    while (singles.length > 0) {
      const closest = this.popClosest(combined.latest, singles)
      combined.addConnected(closest)
    }

    return [...polyglots, combined]
  }

  private popClosest(latest: PathSegment, singles: SegmentChain[]): PathSegment {
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
  normalizeConnection(segment: PathSegment) {
    if (this.end.equals(segment.end)) {
      return new PathSegment(segment.end, segment.begin)
    } else if (this.end.equals(segment.begin)) {
      return segment
    } else {
      return nothing
    }
  }
}

export class Path implements Finite {

  private trianglesLazy: Lazy<readonly Triangle[]> = new Lazy<readonly Triangle[]>(() => this.getTriangles())

  readonly faceType = FaceType.Polygon
  readonly type = ModelType.Primary
  readonly debug: boolean = false
  readonly segments: readonly PathSegment[]

  get triangles(): readonly Triangle[] {
    return this.trianglesLazy.value
  }

  constructor(segments: PathSegment[], type: ModelType = ModelType.Primary, debug: boolean = false) {
    this.segments = segments
    this.type = ModelType.Primary
    this.debug = debug
  }

  pointLocation(point: Point): number {
    return 0;
  }

  toSpace(space: Space) {
    const translated = this.segments.map(segment => Path.translate(segment, space))
    return new Path(translated, this.type, this.debug)
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

  private static translate(segment: PathSegment, space: Space) {
    const begin = space.translate(segment.begin)
    const end = space.translate(segment.end)
    return new PathSegment(begin, end)
  }
}
