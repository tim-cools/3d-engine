import {SegmentBase} from "./segmentBase"
import {Point} from "./primitives"
import {nothing} from "../../infrastructure/nothing"
import {Space} from "./transformations"

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
