import {
  Face,
  FaceType,
  Model,
  Point,
  Polygon,
  PolygonBuilder,
  Segment,
  SpaceModel,
  SubtractLogger,
  translateSpaceTriangle,
  Triangle
} from "../models"
import {Nothing, nothing} from "../nothing"
import {
  Intersection,
  SegmentIntersection
} from "./intersectionResult"
import {equalsTolerancePoint} from "../models/equals"
import {
  intersectsSpaceModel,
  SpaceModelIntersectionResult,
  TriangleSegmentIntersectionEntry
} from "./intersectsSpaceModel"

export function subtractFaces(master: Model, subtract: SpaceModel, logging: SubtractLogger): Face[] {
  const faces: Face[] = []
  addMasterFaces(master, subtract, logging, faces)
  addSubtractFaces(subtract, master, logging, faces)
  return faces
}

function addMasterFaces(master: Model, subtract: SpaceModel, log: SubtractLogger, faces: Face[]) {
  log.logLine(`- master.faces: ${master.faces}`)
  for (const face of master.faces) {
    if (face.faceType != FaceType.Triangle) {
      throw new Error("Face type not yet implemented: " + FaceType[face.faceType])
    }
    addMasterTriangle(subtract, face, log, faces)
  }
}

function addMasterTriangle(subtract: SpaceModel, triangle: Triangle, log: SubtractLogger, faces: Face[]) {

  const intersection = intersectsSpaceModel(triangle, subtract)

  console.log(`addMasterTriangle: 1: ${intersection}`)

  if (intersection.inModel) {
    //faces.push(triangle.disabled(true))
  } else if (!intersection.hasIntersections) {
    faces.push(triangle)
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

function addSubtractFaces(subtract: SpaceModel, master: Model, log: SubtractLogger, faces: Face[]) {
  /*
  log.logLine(`- subtract.faces: ${subtract.model.faces.length}`)
  for (const face of subtract.model.faces) {
    addSubtractFace(face, subtract, master, log, faces)
  }
}

function addSubtractFace(face: Face, subtract: SpaceModel, master: Model, log: SubtractLogger, faces: Face[]) {
  log.logLine(`  - subtract.triagles: ${subtract.model.faces.length}`)
  const triangles = face.triangles()
  for (const triangle of triangles) {
    addSubtractTriangle(triangle, subtract, master, log, faces)
  }
 */
}

function addSubtractTriangle(triangle: Triangle, subtract: SpaceModel, master: Model, log: SubtractLogger, faces: Face[]) {

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

function partialFace(subtract: SpaceModel, triangle: Triangle, intersection: SpaceModelIntersectionResult): Face | Nothing {

  let masterFace: Face = triangle;
  for (const triangleSegmentIntersection of intersection.intersections) {
    for (const segmentIntersection of triangleSegmentIntersection.intersections) {

      const partial: Polygon | Nothing = masterFace.faceType == FaceType.Triangle
        ? partialTriangleIntersection(masterFace as Triangle, segmentIntersection)
        : partialPolygonIntersection(masterFace as Polygon, segmentIntersection)

      if (partial != nothing) {
        masterFace = partial
      }
    }
  }

  return masterFace
}

function partialTriangleIntersection(masterTriangle: Triangle, intersection: TriangleSegmentIntersectionEntry): Polygon | Nothing {

  const polygon = new PolygonBuilder();
  polygon.add(masterTriangle.point1)
  polygon.add(masterTriangle.point2)
  polygon.add(masterTriangle.point3)
  polygon.add(masterTriangle.point1)

  return partialPolygonIntersection(polygon.polygon(), intersection)
}

function partialPolygonIntersection(masterPolygon: Polygon, segmentIntersection: TriangleSegmentIntersectionEntry): Polygon | Nothing {

  if (masterPolygon.points.length == 0) {
    return nothing
  }

  const resultPolygon = new PolygonBuilder()
  for (const segment of masterPolygon.segments) {

    if (!segment.equals(segmentIntersection.segment)) {
      continue
    }

    if (segmentIntersection.intersection.type == Intersection.None || segmentIntersection.intersection.type == Intersection.Point) {
      if (resultPolygon.points.length == 0) {
        resultPolygon.add(segment.begin)
      }
      resultPolygon.add(segment.end)
    } else if (segmentIntersection.intersection.type == Intersection.Segment) {
      addPolygonPartialSegment(segment, segmentIntersection.intersection, resultPolygon)
    } else {
      throw new Error("Not yet implemented")
    }
  }

  return resultPolygon.polygon();
}

function addPolygonPartialSegment(segment: Segment, intersection: SegmentIntersection, resultPolygon: PolygonBuilder) {

  const {begin, end} = orderBeginAndEnd(segment, intersection.segment)

  if (segment.begin.equals(begin)) {
    resultPolygon.addSegment(end, segment.end)
  } else if (segment.end.equals(end)) {
    resultPolygon.addSegment(segment.begin, begin)
  } else {
    resultPolygon.add(segment.begin)
    resultPolygon.add(begin)
    const inlet = sharedPoint(intersection.sourceSegments)
    if (inlet != nothing) {
      resultPolygon.add(inlet)
    }
    resultPolygon.add(end)
    resultPolygon.add(segment.end)
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
