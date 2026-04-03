import {Face, FaceType, Model, ModelType, Path, Point, Segment, SpaceModel, Triangle} from "../models"
import {Nothing, nothing} from "../../infrastructure/nothing"
import {IntersectionType, SegmentIntersection} from "./intersectionResult"
import {equalsTolerancePoint} from "../models/equals"
import {intersectsTriangleModel, SpaceModelIntersectionResult} from "./intersectsTriangleModel"
import {Logger} from "../models/logger"
import {any, pushMany} from "../../infrastructure"
import {SubtractModels} from "./subtractModels"
import {PathBuilder} from "../models/pathBuilder"

export type SubtractFacesResult = {points: Point[], segments: Segment[], faces: Face[]}

export class DebugInfo {

  readonly highlightTriangleAndIntersectionsHashCodes: number[]

  constructor(highlightTrianglesForDebugging: number[] | Nothing = nothing) {
    this.highlightTriangleAndIntersectionsHashCodes = highlightTrianglesForDebugging ?? []
  }

  highlightTriangle(hash: number): Boolean {
    return any(this.highlightTriangleAndIntersectionsHashCodes, value => value == hash)
  }
}

export function subtractFaces(models: SubtractModels, logging: Logger, debugInfo: DebugInfo | Nothing = nothing): SubtractFacesResult {

  const points: Point[] = [models.master.middle.secondary(true), models.subtract.middle.primary(true)]
  const faces: Face[] = []
  const segments: Segment[] = []
  debugInfo = debugInfo ?? new DebugInfo()

  addSubtractFaces(models.subtract, models.master, logging, faces, segments, debugInfo)
  addMasterFaces(models.master, models.subtract, logging, faces, points, segments, debugInfo)

  return {points: points, segments: segments, faces: faces}
}

function addMasterFaces(master: Model, subtract: SpaceModel, log: Logger, faces: Face[], points: Point[], segments: Segment[], debugInfo: DebugInfo) {
  log.logLine(`  master.faces: ${master.faces}`)
  for (let index = 0; index < master.faces.length; index++){
    const face = master.faces[index]
    if (face.faceType != FaceType.Triangle) {
      throw new Error("Face type not yet implemented: " + FaceType[face.faceType])
    }
    log.logLine(`master face: ${index} - ${face.toString()}`)
    addMasterTriangle(subtract, face, log, faces, points, segments, debugInfo)
  }
}

function addMasterTriangle(subtract: SpaceModel, triangle: Triangle, log: Logger, faces: Face[], points: Point[], segments: Segment[], debugInfo: DebugInfo) {

  if (debugInfo.highlightTriangle(triangle.id)) {
    faces.push(triangle.highlightMax())
    return
  }

  const intersection = intersectsTriangleModel(triangle, subtract, log)
  log.logLine("intersectsTriangleModel")

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

  addIntersections(intersection, points, segments)
  log.logLine("addIntersections")
}

function addIntersections(intersection: SpaceModelIntersectionResult, points: Point[], segments: Segment[]) {
  for (const triangleSegmentIntersection of intersection.intersections) {
    if (triangleSegmentIntersection.intersection.type == IntersectionType.Point) {
      points.push(triangleSegmentIntersection.intersection.point.third(true))
    } else {
      segments.push(triangleSegmentIntersection.intersection.segment.third(true))
    }
  }
}

function partialFace(subtract: SpaceModel, masterTriangle: Triangle, intersection: SpaceModelIntersectionResult): Face[] | Nothing {
  const resultPolygon = new PathBuilder(ModelType.Secondary, false)
  addTriangleSegment(masterTriangle, masterTriangle.abSegment, subtract, intersection, resultPolygon)
  addTriangleSegment(masterTriangle, masterTriangle.bcSegment, subtract, intersection, resultPolygon)
  addTriangleSegment(masterTriangle, masterTriangle.caSegment, subtract, intersection, resultPolygon)
  return resultPolygon.closePaths()
}

function addTriangleSegment(masterTriangle: Triangle, segment: Segment, subtract: SpaceModel, intersection: SpaceModelIntersectionResult, resultPolygon: PathBuilder) {

  const segmentIntersection = intersection.segmentInteraction(segment)
  if (segmentIntersection == nothing || segmentIntersection.type == IntersectionType.None) {
    resultPolygon.addSegment(segment.begin, segment.end)
  } else if (segmentIntersection.type == IntersectionType.Point) {
    addPolygonPartialByPoint(segment, subtract, segmentIntersection.point, intersection, resultPolygon)
  } else if (segmentIntersection.type == IntersectionType.Segment) {
    addPolygonPartialSegment(masterTriangle, segment, intersection, segmentIntersection, resultPolygon)
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

function partialInlet(modelIntersection: SpaceModelIntersectionResult, intersection: SegmentIntersection, masterTriangle: Triangle) {
  if (intersection.sourceSegments.length != 2) {
    return nothing
  }
  let firstSegment = intersection.sourceSegments[0]
  if (masterTriangle.pointLocation(firstSegment.begin) >= 0) {
    return firstSegment.begin
  } else if (masterTriangle.pointLocation(firstSegment.end) >= 0) {
    return firstSegment.end
  }
  return nothing
}

function addPolygonPartialSegment(masterTriangle: Triangle, segment: Segment, modelIntersection: SpaceModelIntersectionResult, intersection: SegmentIntersection, resultPolygon: PathBuilder) {

  if (segment.equals(intersection.segment) ||
    (modelIntersection.segmentIntersections < 1 && modelIntersection.pointIntersections < 2)) {
    resultPolygon.addSegment(segment.begin, segment.end)
    return;
  }

  const {begin, end} = orderBeginAndEnd(segment, intersection.segment)

  if (segment.begin.equals(begin)) {
    const inlet = partialInlet(modelIntersection, intersection, masterTriangle)
    if (inlet != nothing) {
      resultPolygon.addSegment(inlet, end)
    }
    resultPolygon.addSegment(end, segment.end)
  } else if (segment.end.equals(end)) {
    resultPolygon.addSegment(segment.begin, begin)
    const inlet = partialInlet(modelIntersection, intersection, masterTriangle)
    if (inlet != nothing) {
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

function addSubtractFaces(subtract: SpaceModel, master: Model, log: Logger, faces: Face[], segments: Segment[], debugInfo: DebugInfo) {
  log.logLine(`subtract.faces: ${subtract.faces.length}`)
  for (const face of subtract.faces) {
    addSubtractFace(face, subtract, master, log, faces, segments, debugInfo)
  }
}

function addSubtractFace(face: Face, subtract: SpaceModel, master: Model, log: Logger, faces: Face[],segments: Segment[], debugInfo: DebugInfo) {
  log.logLine(`  subtract.triangles: ${face.triangles}`)
  for (const triangle of face.triangles) {
    addSubtractTriangle(triangle, subtract, master, log, faces, segments, debugInfo)
  }
}

function highlightIntersectionTriangles(subtractTriangle: Triangle, faces: Face[], modelIntersection: SpaceModelIntersectionResult) {
  for (const intersection of modelIntersection.intersections) {
    for (const intersectionTriangle of intersection.triangles) {
      if (!subtractTriangle.equals(intersectionTriangle)) {
        faces.push(intersectionTriangle.highlight())
      }
    }
  }
}

function addSubtractTriangle(triangle: Triangle, subtract: SpaceModel, master: Model, log: Logger, faces: Face[], segments: Segment[], debugInfo: DebugInfo) {

  const intersection = intersectsTriangleModel(triangle, master, log)

  //addIntersections(intersection, points, segments)

  //console.log(`----- addMasterTriangle - outside model: ${intersection.outsideModel} - hasIntersections: ${intersection.hasIntersections}`)
  if (debugInfo.highlightTriangle(triangle.id)) {
    faces.push(triangle.highlightMax())
    highlightIntersectionTriangles(triangle, faces, intersection)
  } else if (intersection.outsideModel) {
    /*
    segments.push(triangle.abSegment().disabled(true))
    segments.push(triangle.bcSegment().disabled(true))
    segments.push(triangle.caSegment().disabled(true))
    */
  } else if (!intersection.hasIntersections) {
    faces.push(triangle.disabled(true))
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
  addSubtractTriangleSegment(triangle, triangle.abSegment, subtract, intersection, resultPolygon)
  addSubtractTriangleSegment(triangle, triangle.bcSegment, subtract, intersection, resultPolygon)
  addSubtractTriangleSegment(triangle, triangle.caSegment, subtract, intersection, resultPolygon)
  return resultPolygon.closePaths()
}

function addSubtractTriangleSegment(subtractTriangle: Triangle, segment: Segment, subtract: SpaceModel, intersection: SpaceModelIntersectionResult, resultPolygon: PathBuilder) {

  const segmentIntersection = intersection.segmentInteraction(segment)
  if (segmentIntersection == nothing || segmentIntersection.type == IntersectionType.None) {
    resultPolygon.addSegment(segment.begin, segment.end)
  } else if (segmentIntersection.type == IntersectionType.Point) {
    addPolygonPartialByPoint(segment, subtract, segmentIntersection.point, intersection, resultPolygon)
  } else if (segmentIntersection.type == IntersectionType.Segment) {
    addPolygonPartialSegment(subtractTriangle, segment, intersection, segmentIntersection, resultPolygon)
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
