import {
  Face,
  FaceType,
  Model,
  Point,
  PathBuilder,
  Segment,
  SpaceModel,
  translateSpaceTriangle,
  Triangle
} from "../models"
import {Nothing, nothing} from "../nothing"
import {IntersectionType, SegmentIntersection} from "./intersectionResult"
import {equalsTolerancePoint} from "../models/equals"
import {intersectsTriangleModel, SpaceModelIntersectionResult} from "./intersectsTriangleModel"
import {Logger} from "../models/logger"

export type SubtractFacesResult = {points: Point[], segments: Segment[], faces: Face[]}

export function subtractFaces(master: Model, subtract: SpaceModel, logging: Logger): SubtractFacesResult {
  const points: Point[] = [master.middle.third(true), subtract.middle.third(true)]
  const faces: Face[] = []
  const segments: Segment[] = []
  addMasterFaces(master, subtract, logging, faces, points, segments)
  addSubtractFaces(subtract, master, logging, faces)
  return {points: points, segments: segments, faces: faces}
}

function addMasterFaces(master: Model, subtract: SpaceModel, log: Logger, faces: Face[], points: Point[], segments: Segment[]) {
  log.logLine(`- master.faces: ${master.faces}`)
  for (let index = 0; index < master.faces.length; index++){
    const face = master.faces[index]
    if (face.faceType != FaceType.Triangle) {
      throw new Error("Face type not yet implemented: " + FaceType[face.faceType])
    }
    log.logLine("master: " + index)
    addMasterTriangle(subtract, face, log, faces, points, segments)
  }
}

function addMasterTriangle(subtract: SpaceModel, triangle: Triangle, log: Logger, faces: Face[], points: Point[], segments: Segment[]) {

  const intersection = intersectsTriangleModel(triangle, subtract, log)
  log.logLine("intersectsTriangleModel")

  addIntersections(intersection, points, segments)
  log.logLine("addIntersections")

  //console.log(`----- addMasterTriangle - outside model: ${intersection.outsideModel} - hasIntersections: ${intersection.hasIntersections}`)

  if (intersection.outsideModel) {
    faces.push(triangle)
  } else if (!intersection.hasIntersections) {
    //faces.push(triangle.disabled(triangle))
  } else {
    const polygon = partialFace(subtract, triangle, intersection)
    if (polygon != nothing) {
      faces.push(polygon)
    } else {
      //faces.push(triangle.disabled(true))
    }
  }

  /*
 const beginInSubtract = subtract.contains(segment.begin)
  const endInSubtract = subtract.contains(segment.end)

  log.log(segment, `in subtract begin: ${beginInSubtract} end: ${endInSubtract}`)

  else if (beginInSubtract || endInSubtract) {
    const partials = SubtractModel.partials(subtract, segment, intersections)
    if (partials != nothing) {
      partials.map(partial => segments.push(partial))
    } else {
      segments.push(segment.disabled(true))
    }
  }
  */
}

function addIntersections(intersection: SpaceModelIntersectionResult, points: Point[], segments: Segment[]) {
  for (const triangleSegmentIntersection of intersection.intersections) {
    if (triangleSegmentIntersection.intersection.type == IntersectionType.Point) {
      points.push(triangleSegmentIntersection.intersection.point.third(true))
    } else {
      points.push(triangleSegmentIntersection.intersection.segment.begin.third(true))
      points.push(triangleSegmentIntersection.intersection.segment.end.third(true))
    }
  }
}

function addSubtractFaces(subtract: SpaceModel, master: Model, log: Logger, faces: Face[]) {
  /*
  log.logLine(`- subtract.faces: ${subtract.model.faces.length}`)
  for (const face of subtract.model.faces) {
    addSubtractFace(face, subtract, master, log, faces)
  }
}

function addSubtractFace(face: Face, subtract: SpaceModel, master: Model, log: Logger, faces: Face[]) {
  log.logLine(`  - subtract.triagles: ${subtract.model.faces.length}`)
  const triangles = face.triangles()
  for (const triangle of triangles) {
    addSubtractTriangle(triangle, subtract, master, log, faces)
  }
 */
}

function addSubtractTriangle(triangle: Triangle, subtract: SpaceModel, master: Model, log: Logger, faces: Face[]) {

  const subtractToMaster = translateSpaceTriangle(triangle, subtract)
  const point1InMaster = master.contains(subtractToMaster.point1)
  const point2InMaster = master.contains(subtractToMaster.point2)
  const point3InMaster = master.contains(subtractToMaster.point3)

  /*
  log.log(subtractToMaster, `in master begin: ${beginInMaster} end: ${endInMaster}`)

  if (beginInMaster && endInMaster) {
    if (master.onBoundary(subtractToMaster.begin)) {
      intersections.push(subtractToMaster.begin)
    }
    if (master.onBoundary(subtractToMaster.end)) {
      intersections.push(subtractToMaster.end)
    }
    segments.push(subtractToMaster.secondary())
  } else if (beginInMaster || endInMaster) {
    const partials = SubtractModel.partialMaster(master, subtractToMaster, intersections)
    if (partials != nothing) {
      partials.map(partial => segments.push(partial))
    } else {
      segments.push(subtractToMaster.disabled(true))
    }
  } else {
    segments.push(subtractToMaster.disabled(true))
  }
  */
}

function partialFace(subtract: SpaceModel, masterTriangle: Triangle, intersection: SpaceModelIntersectionResult): Face | Nothing {
  const resultPolygon = new PathBuilder()
  addTriangleSegment(masterTriangle.abSegment(), subtract, intersection, resultPolygon)
  addTriangleSegment(masterTriangle.bcSegment(), subtract, intersection, resultPolygon)
  addTriangleSegment(masterTriangle.caSegment(), subtract, intersection, resultPolygon)
  return resultPolygon.closePath()
}

function addTriangleSegment(segment: Segment, subtract: SpaceModel, intersection: SpaceModelIntersectionResult, resultPolygon: PathBuilder) {

  const segmentIntersection = intersection.segmentInteraction(segment)
  if (segmentIntersection == nothing || segmentIntersection.type == IntersectionType.None) {
    resultPolygon.addSegment(segment.begin, segment.end)
  } else if (segmentIntersection.type == IntersectionType.Point) {
    addPolygonPartialByPoint(segment, subtract, segmentIntersection.point, resultPolygon)
  } else if (segmentIntersection.type == IntersectionType.Segment) {
    addPolygonPartialSegment(segment, segmentIntersection, resultPolygon)
  } else {
    throw new Error("Not yet implemented")
  }
}

function addPolygonPartialByPoint(segment: Segment, subtract: SpaceModel, point: Point, resultPolygon: PathBuilder) {

  const pointLocation = segment.pointLocation(point)
  console.log(`----- SSSSS > ${segment} - ${point} (location: ${pointLocation})`)

  /* todo if (segment.pointLocation(point) >= 0) {
    resultPolygon.add(segment.begin)
    resultPolygon.add(segment.end)
  } else
  if (containsPointModel(segment.begin, subtract)) {
    resultPolygon.add(point)
    resultPolygon.add(segment.end)
  } else {
    resultPolygon.add(segment.begin)
    resultPolygon.add(point)
  }
  */
}

function addPolygonPartialSegment(segment: Segment, intersection: SegmentIntersection, resultPolygon: PathBuilder) {

  const {begin, end} = orderBeginAndEnd(segment, intersection.segment)

  if (segment.begin.equals(begin)) {
    resultPolygon.addSegment(end, segment.end)
  } else if (segment.end.equals(end)) {
    resultPolygon.addSegment(segment.begin, begin)
  } else {
    /* todo
    resultPolygon.add(segment.begin)
    resultPolygon.add(begin)
    const inlet = sharedPoint(intersection.sourceSegments)
    if (inlet != nothing) {
      resultPolygon.add(inlet)
    }
    resultPolygon.add(end)
    resultPolygon.add(segment.end)
     */
  }
}

function orderBeginAndEnd(segment: Segment, segmentIntersection: Segment) {
  const beginCloser = segment.begin.distanceToPoint(segmentIntersection.begin) < segment.begin.distanceToPoint(segmentIntersection.end)
  const begin = beginCloser ? segmentIntersection.begin : segmentIntersection.end
  const end = beginCloser ? segmentIntersection.end : segmentIntersection.begin
  return {begin, end}
}

export function sharedPoint(sourceSegments: readonly Segment[]): Point | Nothing {
  if (sourceSegments.length < 2) {
    return nothing
  }
  if (sourceSegments.length > 2) {
    throw new Error("Not supported.")
  }
  if (equalsTolerancePoint(sourceSegments[0].begin, sourceSegments[1].begin)
   || equalsTolerancePoint(sourceSegments[0].begin, sourceSegments[1].end)) {
    return sourceSegments[0].begin
  }
  if (equalsTolerancePoint(sourceSegments[0].end, sourceSegments[1].end)
   || equalsTolerancePoint(sourceSegments[0].end, sourceSegments[1].begin)) {
    return sourceSegments[0].end
  }
  throw new Error("No shared point found.")
}
