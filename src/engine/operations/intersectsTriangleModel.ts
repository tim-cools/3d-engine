import {Point, Segment, SpaceModel, Triangle} from "../models"
import {intersectsTriangles} from "./intersectsTriangles"
import {intersectionTriangleSegment} from "./intersectionTriangleSegment"
import {
  IntersectionType,
  noIntersection,
  NoIntersection,
  PointIntersection,
  SegmentIntersection
} from "./intersectionResult"
import {nothing} from "../nothing"
import {Logger} from "../models/logger"

type TriangleSegmentEntry = {intersection: PointIntersection | SegmentIntersection, segment: Segment}

export class SpaceModelIntersectionResult {

  outsideModel: Boolean
  intersections: TriangleSegmentIntersection[]

  get hasIntersections(): boolean {
    return this.intersections.length > 0
  }

  constructor(outsideModel: Boolean, intersections: TriangleSegmentIntersection[]) {
    this.outsideModel = outsideModel
    this.intersections = intersections
  }

  segmentInteraction(segment: Segment): PointIntersection | SegmentIntersection | NoIntersection {
    let intersection: PointIntersection | SegmentIntersection | NoIntersection = noIntersection
    for (const triangleSegmentIntersection of this.intersections) {
      if (triangleSegmentIntersection.segment.equals(segment)) {
        intersection = triangleSegmentIntersection.intersection
      }
    }
    return intersection
  }
}

export class TriangleSegmentIntersection {

  private trianglesValue: Triangle[] = []

  readonly intersection: PointIntersection | SegmentIntersection
  readonly segment: Segment

  get triangles(): readonly Triangle[]{
    return this.trianglesValue
  }

  constructor(intersection: PointIntersection | SegmentIntersection, segment: Segment) {
    this.intersection = intersection
    this.segment = segment
  }

  addTriangle(triangleInMaster: Triangle) {
    this.trianglesValue.push(triangleInMaster)
  }
}

export function containsPointModel(point: Point, model: SpaceModel): boolean {
  const segment = new Segment(model.middle, point)
  for (const subtractFace of model.faces) {
    for (const subtractTriangle of subtractFace.triangles) {
      const intersection = intersectionTriangleSegment(subtractTriangle, segment)
      if (intersection.type != IntersectionType.None) {
        return false
      }
    }
  }
  return true
}

function middleOfModelToTriangleTetrahedron(middle: Point, subtractTriangle: Triangle) {
  const faceToMiddle = [
    new Triangle(middle, subtractTriangle.point1, subtractTriangle.point2),
    new Triangle(middle, subtractTriangle.point2, subtractTriangle.point3),
    new Triangle(middle, subtractTriangle.point3, subtractTriangle.point1),
  ]
  return faceToMiddle
}

export function intersectsTriangleModel(triangleInMaster: Triangle, model: SpaceModel, log: Logger): SpaceModelIntersectionResult {

  const middle = model.middle
  let outsideModel = true
  let intersections: TriangleSegmentIntersection[] = []

  for (let faceIndex = 0; faceIndex < model.faces.length; faceIndex++){
    const subtractFace = model.faces[faceIndex]

    for (const subtractTriangle of subtractFace.triangles) {

      if (outsideModel) {
        const faceToMiddle = middleOfModelToTriangleTetrahedron(middle, subtractTriangle)
        for (let index = 0; outsideModel && index < faceToMiddle.length ; index++) {
          const faceTriangle = faceToMiddle[index]
          const intersectionBetweenMiddleOfMiddleAndFace = intersectsTriangles(triangleInMaster, faceTriangle)
          if (intersectionBetweenMiddleOfMiddleAndFace) {
            outsideModel = false
          }
        }
      }

      addSegmentIntersections(subtractTriangle, triangleInMaster, intersections)
      log.logLine("addSegmentIntersections: " + faceIndex)
    }
  }

  return new SpaceModelIntersectionResult(outsideModel, intersections)
}

function addSegmentIntersections(subtractTriangle: Triangle, triangleInMaster: Triangle, intersections: TriangleSegmentIntersection[]) {

  const entries: TriangleSegmentEntry[] = []
  addSegmentIntersection(subtractTriangle, triangleInMaster.abSegment(), entries)
  addSegmentIntersection(subtractTriangle, triangleInMaster.bcSegment(), entries)
  addSegmentIntersection(subtractTriangle, triangleInMaster.caSegment(), entries)

  if (entries.length == 0) {
    return nothing
  }

  for (const entry of entries) {
    const intersection = getNewOrExisting(intersections, entry)
    intersection.addTriangle(subtractTriangle)
  }
}

function addSegmentIntersection(subtractTriangle: Triangle, segment: Segment, entries: TriangleSegmentEntry[]) {
  const intersection = intersectionTriangleSegment(subtractTriangle, segment)
  if (intersection.type != IntersectionType.None) {
    entries.push({intersection: intersection, segment: segment})
  }
}

function getNewOrExisting(intersections: TriangleSegmentIntersection[], entry: TriangleSegmentEntry): TriangleSegmentIntersection {
  for (const intersection of intersections) {
    if (intersection.segment.equals(entry.segment) && intersection.intersection.equals(entry.intersection)) {
      return intersection
    }
  }

  const intersection = new TriangleSegmentIntersection(entry.intersection, entry.segment)
  intersections.push(intersection)
  return intersection
}
