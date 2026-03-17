import {Face, FaceType, Model, ModelType, Path, PathBuilder, Point, Segment, SpaceModel, Triangle} from "../models"
import {Nothing, nothing} from "../nothing"
import {IntersectionType, SegmentIntersection} from "./intersectionResult"
import {equalsTolerancePoint} from "../models/equals"
import {intersectsTriangleModel, SpaceModelIntersectionResult} from "./intersectsTriangleModel"
import {Logger} from "../models/logger"
import {pushMany} from "../../infrastructure"

export type SubtractFacesResult = {points: Point[], segments: Segment[], faces: Face[]}

export function subtractFaces(master: Model, subtract: SpaceModel, logging: Logger): SubtractFacesResult {
  const points: Point[] = [master.middle.secondary(true), subtract.middle.primary(true)]
  const faces: Face[] = []
  const segments: Segment[] = []
  addSubtractFaces(subtract, master, logging, faces, segments)
  addMasterFaces(master, subtract, logging, faces, points, segments)
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
    faces.push(triangle.disabled(true))
  } else {
    const paths = partialFace(subtract, triangle, intersection)
    if (paths != nothing) {
      pushMany(faces, paths)
    } else {
      //faces.push(triangle.disabled(true))
    }
  }
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

function partialFace(subtract: SpaceModel, masterTriangle: Triangle, intersection: SpaceModelIntersectionResult): Face[] | Nothing {
  const resultPolygon = new PathBuilder(ModelType.Secondary, false)
  addTriangleSegment(masterTriangle, masterTriangle.abSegment(), subtract, intersection, resultPolygon)
  addTriangleSegment(masterTriangle, masterTriangle.bcSegment(), subtract, intersection, resultPolygon)
  addTriangleSegment(masterTriangle, masterTriangle.caSegment(), subtract, intersection, resultPolygon)
  return resultPolygon.closePaths()
}

function addTriangleSegment(masterTriangle: Triangle, segment: Segment, subtract: SpaceModel, intersection: SpaceModelIntersectionResult, resultPolygon: PathBuilder) {

  const segmentIntersection = intersection.segmentInteraction(segment)
  if (segmentIntersection == nothing || segmentIntersection.type == IntersectionType.None) {
    resultPolygon.addSegment(segment.begin, segment.end)
  } else if (segmentIntersection.type == IntersectionType.Point) {
    addPolygonPartialByPoint(segment, subtract, segmentIntersection.point, intersection, resultPolygon)
  } else if (segmentIntersection.type == IntersectionType.Segment) {
    addPolygonPartialSegment(masterTriangle, segment, segmentIntersection, resultPolygon)
  } else {
    throw new Error("Not yet implemented")
  }
}

function addPolygonPartialByPoint(segment: Segment, subtract: SpaceModel, point: Point, intersection: SpaceModelIntersectionResult, resultPolygon: PathBuilder) {
  if (point.equals(segment.begin) || point.equals(segment.end) || intersection.intersections.length == 1) {
    resultPolygon.addSegment(segment.begin, segment.end)
  } else {
    resultPolygon.addSegment(segment.begin, point)
    resultPolygon.addSegment(point, segment.end)
  }
}

function addPolygonPartialSegment(masterTriangle: Triangle, segment: Segment, intersection: SegmentIntersection, resultPolygon: PathBuilder) {

  if (segment.equals(intersection.segment)) {
    resultPolygon.addSegment(segment.begin, segment.end)
    return;
  }

  const {begin, end} = orderBeginAndEnd(segment, intersection.segment)

  if (segment.begin.equals(begin)) {
    const inlet = intersection.sourceSegments.length == 2
      ? intersection.sourceSegments[0].begin
      : null
    if (inlet != nothing && masterTriangle.pointLocation(inlet) >= 0) {
      resultPolygon.addSegment(inlet, end)
    }
    resultPolygon.addSegment(end, segment.end)
  } else if (segment.end.equals(end)) {
    resultPolygon.addSegment(segment.begin, begin)
    const inlet = intersection.sourceSegments.length == 2
      ? intersection.sourceSegments[0].end
      : null
    if (inlet != nothing && masterTriangle.pointLocation(inlet) >= 0) {
      resultPolygon.addSegment(begin, inlet)
    }
  } else {
    resultPolygon.addSegment(segment.begin, begin)
    const inlet = sharedPoint(intersection.sourceSegments)
    if (inlet != nothing) {
      resultPolygon.addSegment(begin, inlet)
      resultPolygon.addSegment(inlet, end)
    }
    resultPolygon.addSegment(end, segment.end)
  }
}

function addSubtractFaces(subtract: SpaceModel, master: Model, log: Logger, faces: Face[], segments: Segment[]) {
  log.logLine(`- subtract.faces: ${subtract.faces.length}`)
  for (const face of subtract.faces) {
    addSubtractFace(face, subtract, master, log, faces, segments)
  }
}

function addSubtractFace(face: Face, subtract: SpaceModel, master: Model, log: Logger, faces: Face[],segments: Segment[]) {
  log.logLine(`  - subtract.triagles: ${face.triangles}`)
  for (const triangle of face.triangles) {
    addSubtractTriangle(triangle, subtract, master, log, faces, segments)
  }
}

function addSubtractTriangle(triangle: Triangle, subtract: SpaceModel, master: Model, log: Logger, faces: Face[], segments: Segment[]) {

  const intersection = intersectsTriangleModel(triangle, subtract, log)

  //addIntersections(intersection, points, segments)

  //console.log(`----- addMasterTriangle - outside model: ${intersection.outsideModel} - hasIntersections: ${intersection.hasIntersections}`)

  if (intersection.outsideModel) {
    segments.push(triangle.abSegment().disabled(true))
    segments.push(triangle.bcSegment().disabled(true))
    segments.push(triangle.caSegment().disabled(true))
  } else if (!intersection.hasIntersections) {
    //faces.push(triangle.disabled(triangle))
  } else {
    const paths = partialSubtractFace(subtract, triangle, intersection)
    if (paths != nothing) {
      pushMany(faces, paths)
    } else {
      //faces.push(triangle.disabled(true))
    }
  }
}

function partialSubtractFace(subtract: SpaceModel, triangle: Triangle, intersection: SpaceModelIntersectionResult): Path[] | Nothing {
  const resultPolygon = new PathBuilder(ModelType.Disabled, true)
  addSubtractTriangleSegment(triangle, triangle.abSegment(), subtract, intersection, resultPolygon)
  addSubtractTriangleSegment(triangle, triangle.bcSegment(), subtract, intersection, resultPolygon)
  addSubtractTriangleSegment(triangle, triangle.caSegment(), subtract, intersection, resultPolygon)
  return resultPolygon.closePaths()
}

function addSubtractTriangleSegment(subtractTriangle: Triangle, segment: Segment, subtract: SpaceModel, intersection: SpaceModelIntersectionResult, resultPolygon: PathBuilder) {

  const segmentIntersection = intersection.segmentInteraction(segment)
  if (segmentIntersection == nothing || segmentIntersection.type == IntersectionType.None) {
    resultPolygon.addSegment(segment.begin, segment.end)
  } else if (segmentIntersection.type == IntersectionType.Point) {
    addPolygonPartialByPoint(segment, subtract, segmentIntersection.point, intersection, resultPolygon)
  } else if (segmentIntersection.type == IntersectionType.Segment) {
    addPolygonPartialSegment(subtractTriangle, segment, segmentIntersection, resultPolygon)
  } else {
    throw new Error("Not yet implemented")
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
