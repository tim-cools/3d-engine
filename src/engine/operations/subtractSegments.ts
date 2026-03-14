import {
  ModelType,
  Point,
  Segment,
  CanContainPoint,
  Model,
  SpaceModel,
} from "../models"
import {Nothing, nothing} from "../nothing"
import {intersectionTriangleSegment} from "./intersectionTriangleSegment"
import {IntersectionType} from "./intersectionResult"
import {Logger} from "../models/logger"

export function subtractSegments(master: Model, subtract: SpaceModel, logging: Logger): Segment[] {

  const intersections: Point[] = []
  const segments: Segment[] = []
  addMasterSegments(master, subtract, logging, segments, intersections)
  addSubtractSegments(subtract, master, logging, segments, intersections)
  addIntersectionsPath(intersections, segments, logging)
  return segments
}

function addMasterSegments(master: Model, subtract: SpaceModel, log: Logger, segments: Segment[], intersections: Point[]) {
  log.logLine(`- master.segments: ${master.segments.length}`)
  for (const segment of master.segments) {
    addMasterSegment(subtract, segment, log, segments, intersections)
  }
}

function addMasterSegment(subtract: SpaceModel, segment: Segment, log: Logger, segments: Segment[], intersections: Point[]) {
  const beginInSubtract = subtract.contains(segment.begin)
  const endInSubtract = subtract.contains(segment.end)

  log.log(segment, `in subtract begin: ${beginInSubtract} end: ${endInSubtract}`)

  if (beginInSubtract && endInSubtract) {
    segments.push(segment.disabled(true))
  } else if (!beginInSubtract && !endInSubtract) {
    segments.push(segment)
  } else {
    const partials = getPartials(subtract, segment, intersections)
    if (partials != nothing) {
      partials.map(partial => segments.push(partial))
    } else {
      segments.push(segment)
    }
  }
}

function addSubtractSegments(subtract: SpaceModel, master: Model, log: Logger, segments: Segment[], intersections: Point[]) {
  log.logLine(`- subtract.segments: ${subtract.segments.length}`)
  for (const segment of subtract.segments) {
    addSubtractSegment(segment, subtract, master, log, segments, intersections)
  }
}

function addSubtractSegment(segment: Segment, subtract: SpaceModel, master: Model, log: Logger, segments: Segment[], intersections: Point[]) {

  const beginInMaster = master.contains(segment.begin)
  const endInMaster = master.contains(segment.end)

  log.log(segment, `in master begin: ${beginInMaster} end: ${endInMaster}`)

  if (beginInMaster && endInMaster) {
    if (master.onBoundary(segment.begin)) {
      intersections.push(segment.begin)
    }
    if (master.onBoundary(segment.end)) {
      intersections.push(segment.end)
    }
    segments.push(segment.secondary())
  } else if (beginInMaster || endInMaster) {
    const partials = partialMaster(master, segment, intersections)
    if (partials != nothing) {
      partials.map(partial => segments.push(partial))
    } else {
      segments.push(segment.disabled(true))
    }
  } else {
    segments.push(segment.disabled(true))
  }
}

function addIntersectionsPath(intersections: Point[], segments: Segment[], log: Logger) {

  log.logLine(`- intersections: ${intersections.length}`)

  if (intersections.length <= 1) return

  const start = intersections[0]
  let begin = intersections[0]
  intersections.splice(0, 1)

  let last: Segment | Nothing = nothing
  while (intersections.length > 0) {
    const end = closestPoint(intersections, begin)
    if (!begin.equals(end)) {
      last = new Segment(begin, end, ModelType.Third)
      segments.push(last)
    }
    begin = end
  }

  if (!begin.equals(start)) {
    const closing = new Segment(start, begin, ModelType.Third);
    if (last != nothing && !last.equals(closing)) {
      segments.push(closing)
    }
  }
}

function getPartials(subtract: SpaceModel, segment: Segment, intersections: Point[]): Segment[] | Nothing {
  for (const face of subtract.faces) {
    for (const triangle of face.triangles) {
      const intersection = intersectionTriangleSegment(triangle, segment)
      if (intersection.type == IntersectionType.Point) {
        intersections.push(intersection.point)
        return partialSegmentsPointIntersection(subtract, segment, intersection.point, false)
      } else if (intersection.type == IntersectionType.Segment) {
        return partialSubtractIntersectionSegments(segment, intersection.segment, intersections)
      }
    }
  }
  return nothing
}

function partialMaster(model: Model, segment: Segment, intersections: Point[]): Segment[] | Nothing {
  for (let index = 0; index < model.faces.length; index++){
    const face = model.faces[index]
    for (const triangle of face.triangles) {
      const intersection = intersectionTriangleSegment(triangle, segment)
      if (intersection.type == IntersectionType.Point) {
        intersections.push(intersection.point)
        return partialSegmentsPointIntersection(model, segment, intersection.point,true)
      } else if (intersection.type == IntersectionType.Segment) {
        console.log("Side case not implemented!")
      }
    }
  }
  return nothing
}

function partialSegmentsPointIntersection(subtract: CanContainPoint, segment: Segment, intersectionPoint: Point, invert: boolean) {
  const result: Segment[] = []
  if (subtract.contains(segment.begin) !== invert) {
    if (!intersectionPoint.equals(segment.end)) {
      result.push(new Segment(intersectionPoint, segment.end, ModelType.Secondary))
    }
    if (!intersectionPoint.equals(segment.begin)) {
      result.push(new Segment(segment.begin, intersectionPoint, ModelType.Disabled, true))
    }
  } else {
    if (!intersectionPoint.equals(segment.end)) {
      result.push(new Segment(intersectionPoint, segment.end, ModelType.Disabled, true))
    }
    if (!intersectionPoint.equals(segment.begin)) {
      result.push(new Segment(segment.begin, intersectionPoint, ModelType.Secondary),)
    }
  }
  return result
}


function partialSubtractIntersectionSegments(segment: Segment, intersectionSegment: Segment, intersections: Point[]) {

  const {begin, end} = orderBeginAndEnd(segment, intersectionSegment)
  const result: Segment[] = []
  if (segment.begin.equals(begin)) {
    result.push(new Segment(segment.begin, intersectionSegment.end, ModelType.Disabled, true))
    result.push(new Segment(intersectionSegment.end, segment.end, ModelType.Secondary))
    intersections.push(intersectionSegment.end)
  } else if (segment.end.equals(end)) {
    result.push(new Segment(segment.begin, intersectionSegment.begin, ModelType.Secondary))
    result.push(new Segment(intersectionSegment.begin, segment.end, ModelType.Disabled, true))
    intersections.push(intersectionSegment.begin)
  } else {
    throw new Error("Invalid segment intersection")
  }
  return result
}

function closestPoint(intersections: Point[], point: Point) {

  let closest = intersections[0]
  let closestDistance = point.distanceToPoint(intersections[0])
  let closestIndex = 0

  for (let index = 1; index < intersections.length; index++) {
    const intersection = intersections[index]
    const distance = point.distanceToPoint(intersection)

    if (distance < closestDistance) {
      closest = intersection
      closestDistance = distance
      closestIndex = index
    }
  }
  intersections.splice(closestIndex, 1)
  return closest
}

function orderBeginAndEnd(segment: Segment, segmentIntersection: Segment) {
  const beginCloser = segment.begin.distanceToPoint(segmentIntersection.begin) < segment.begin.distanceToPoint(segmentIntersection.end)
  const begin = beginCloser ? segmentIntersection.begin : segmentIntersection.end
  const end = beginCloser ? segmentIntersection.end : segmentIntersection.begin
  return {begin, end}
}
