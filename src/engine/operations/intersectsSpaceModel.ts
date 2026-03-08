import {Segment, SpaceModel, Triangle} from "../models"
import {intersectsTriangles} from "./intersectsTriangles"
import {intersectionTriangleSegment} from "./intersectionTriangleSegment"
import {Intersection, NoIntersection, PointIntersection, SegmentIntersection} from "./intersectionResult"
import {nothing} from "../nothing"

export class SpaceModelIntersectionResult {

  inModel: Boolean
  intersections: TriangleSegmentIntersection[]

  get hasIntersections(): boolean {
    return this.intersections.length > 0
  }

  constructor(inModel: Boolean, intersections: TriangleSegmentIntersection[]) {
    this.inModel = inModel
    this.intersections = intersections
  }
}

export class TriangleSegmentIntersectionEntry {

  intersection: PointIntersection | SegmentIntersection | NoIntersection
  segment: Segment

  constructor(intersection: PointIntersection | SegmentIntersection | NoIntersection, segment: Segment) {
    this.intersection = intersection
    this.segment = segment
  }
}

export class TriangleSegmentIntersection {

  subtractTriangle: Triangle
  intersections: readonly TriangleSegmentIntersectionEntry[]

  constructor(subtractTriangle: Triangle, entries: readonly TriangleSegmentIntersectionEntry[]) {
    this.intersections = entries
    this.subtractTriangle = subtractTriangle
  }
}

export function intersectsSpaceModel(triangleInMaster: Triangle, childSpaceModel: SpaceModel): SpaceModelIntersectionResult {

  const middle = childSpaceModel.middle
  const faceToMiddle = [
    new Triangle(middle, triangleInMaster.point1, triangleInMaster.point2),
    new Triangle(middle, triangleInMaster.point2, triangleInMaster.point3),
    new Triangle(middle, triangleInMaster.point3, triangleInMaster.point1),
  ]

  let inModel = false
  let intersections: TriangleSegmentIntersection[] = []

  for (const subtractFace of childSpaceModel.faces) {
    for (const subtractTriangle of subtractFace.triangles) {

      if (!inModel) {
        for (const faceTriangle of faceToMiddle) {
          const intersection = intersectsTriangles(subtractTriangle, faceTriangle)
          if (intersection) {
            inModel = true
          }
        }
      }

      addSegmentIntersections(subtractTriangle, triangleInMaster, intersections)
    }
  }

  return new SpaceModelIntersectionResult(inModel, intersections)
}

function addSegmentIntersections(subtractTriangle: Triangle, triangleInMaster: Triangle, intersections: TriangleSegmentIntersection[]) {

  const entries: TriangleSegmentIntersectionEntry[] = []
  addSegmentIntersection(subtractTriangle, triangleInMaster.abSegment(), entries)
  addSegmentIntersection(subtractTriangle, triangleInMaster.bcSegment(), entries)
  addSegmentIntersection(subtractTriangle, triangleInMaster.caSegment(), entries)

  if (entries.length == 0) {
    return nothing
  }

  const intersection = new TriangleSegmentIntersection(subtractTriangle, entries)
  intersections.push(intersection)
}

function addSegmentIntersection(subtractTriangle: Triangle, segment: Segment, entries: TriangleSegmentIntersectionEntry[]) {
  const intersection = intersectionTriangleSegment(subtractTriangle, segment)
  if (intersection.type != Intersection.None) {
    entries.push(new TriangleSegmentIntersectionEntry(intersection, segment))
  }
}
