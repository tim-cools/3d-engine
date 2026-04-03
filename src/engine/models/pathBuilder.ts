import {Point, Segment} from "./primitives"
import {Nothing, nothing} from "../../infrastructure/nothing"
import {Triangle} from "./triangle"
import {Space} from "./transformations"
import {FaceType} from "./faceType"
import {pushMany} from "../../infrastructure"
import {intersectionTriangleSegment, IntersectionType} from "../intersections"
import {hashCode} from "../../infrastructure/stringFunctions"
import {ValuesCache} from "../../infrastructure/valuesCache"
import {SegmentBase} from "./segmentBase"
import {Finite} from "./finite"
import {ModelType} from "./modelType"
import {Path} from "./path"
import {PathSegment} from "./pathSegment"

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
