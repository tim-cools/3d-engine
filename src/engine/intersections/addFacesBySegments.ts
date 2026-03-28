import {angleTo, Face, FaceType, Point, Segment, Triangle} from "../models"
import {intersectionTriangleSegment} from "./intersectionTriangleSegment"
import {IntersectionType} from "./intersectionResult"
import {equalsTolerance} from "../models/equals"

type SegmentNode = {point: Point, segments: Segment[]}
type SegmentLength = {segment: Segment, length: number}
type Segment2Length = {segment1: Segment, segment2: Segment, segment3: Segment, angle: number, length: number}

function countPerAmount(pointsPerAmount: Map<number, SegmentNode[]>, value: SegmentNode) {
  const node = pointsPerAmount.get(value.segments.length)
  if (node == undefined) {
    pointsPerAmount.set(value.segments.length, [value])
  } else {
    node.push(value)
  }
}

function intersects(face: Triangle, segment: Segment) {
  let intersection = intersectionTriangleSegment(face, segment)
  if (intersection.type == IntersectionType.Point && !segment.begin.equals(intersection.point) && !segment.end.equals(intersection.point)) {
    return true
  } else if (intersection.type == IntersectionType.Segment && !intersection.segment.equals(segment)) {
    return true
  }
  return false
}

function triangleIntersects(triangle: Triangle, faces: Face[]) {

  const segment1 = triangle.abSegment
  const segment2 = triangle.bcSegment
  const segment3 = triangle.caSegment

  for (const face of faces) {
    if (face.faceType != FaceType.Triangle) throw new Error("Not supported")
    if (face.equals(triangle)) return true

    if (intersects(face, segment1) || intersects(face, segment2) || intersects(face, segment3)) {
      return true
    }
  }

  return false
}

function addSegmentFaces(pointNode: SegmentNode, nodes: Map<string, SegmentNode>, faces: Face[], trianglesAdded: Map<string, Triangle>) {

  //countPerAmount(pointsPerAmount, pointNode)
  if (pointNode.segments.length > 4) return

  for (const segment of pointNode.segments) {

    const connectingPoint = segment.begin.equals(pointNode.point) ? segment.end : segment.begin
    const connectingNode = nodes.get(connectingPoint.toString())
    if (connectingNode == undefined) {
      throw new Error(`Couldn't find connectingNode: ${connectingPoint.toString()}`)
    }

    const options: Segment2Length[] = []
    for (const connectingSegment of connectingNode.segments) {
      if (connectingSegment.equals(segment)) continue

      const firstSegment = createFirstSegment(segment, connectingSegment)
      const secondSegment = createSecondSegment(segment, connectingSegment)

      if (firstSegment.vector.direction.equals(secondSegment.vector.direction)) {
        continue
      }

      const closingSegment = createClosingSegment(firstSegment, secondSegment)
      if (equalsTolerance(closingSegment.length, 0)) {
        throw new Error("Not expected")
      }

      let angle = angleTo(firstSegment, secondSegment)
      console.log(angle)
      if (angle < 1) {
        continue
      }

      options.push({
        segment1: firstSegment,
        segment2: secondSegment,
        segment3: closingSegment,
        angle: angle,
        length: closingSegment.length
      })
    }

    options.sort((first, second) => first.length > second.length ? -1 : 1)

    for (let i = 0; i < Math.min(options.length, 999); i++) {
      const option = options[i]
      const triangle = createTriangle(option.segment1, option.segment2, option.segment3)
      if (!triangleIntersects(triangle, faces)) {
        faces.push(triangle)
      }
    }
  }
}

export function addTrianglesBySegments(segments: Segment[], faces: Face[]) {

  const trianglesAdded = new Map<string, Triangle>()
  const nodes = createNodes(segments)

  nodes.forEach((value: SegmentNode) => {
    addSegmentFaces(value, nodes, faces, trianglesAdded)
  })
}

function getOrNewNode(nodes: Map<string, SegmentNode>, point: Point): SegmentNode {
  const key = point.toString()
  const node = nodes.get(key)
  if (node != undefined) {
    return node
  } else {
    const node = {point: point, segments: []}
    nodes.set(key, node)
    return node
  }
}

function createNodes(segments: Segment[]) {
  const nodes: Map<string, SegmentNode> = new Map<string, SegmentNode>()
  for (const segment of segments) {
    if (segment.debug) continue
    const beginNode = getOrNewNode(nodes, segment.begin)
    beginNode.segments.push(segment)
    const endNode = getOrNewNode(nodes, segment.end)
    endNode.segments.push(segment)
  }
  return nodes
}

function createTriangle(segment: Segment, connectingSegment: Segment, thirdSegment: Segment): Triangle {
  const point1 = segment.begin
  const point2 = segment.begin.equals(connectingSegment.begin) ? connectingSegment.end : connectingSegment.begin
  const point3 = connectingSegment.begin.equals(thirdSegment.begin) ? thirdSegment.end : thirdSegment.begin
  return new Triangle(point1, point2, point3)
}

function createFirstSegment(segment: Segment, connectingSegment: Segment) {
  if (segment.begin.equals(connectingSegment.begin)) {
    return new Segment(segment.end, segment.begin)
  } else if (segment.begin.equals(connectingSegment.end)) {
    return new Segment(segment.end, segment.begin)
  } else if (segment.end.equals(connectingSegment.begin)) {
    return new Segment(segment.begin, segment.end)
  } else if (segment.end.equals(connectingSegment.end)) {
    return new Segment(segment.begin, segment.end)
  }
  throw new Error("Segments don't connect")
}

function createSecondSegment(segment: Segment, connectingSegment: Segment) {
  if (segment.begin.equals(connectingSegment.begin)) {
    return new Segment(connectingSegment.begin, connectingSegment.end)
  } else if (segment.begin.equals(connectingSegment.end)) {
    return new Segment(connectingSegment.end, connectingSegment.begin)
  } else if (segment.end.equals(connectingSegment.begin)) {
    return new Segment(connectingSegment.begin, connectingSegment.end)
  } else if (segment.end.equals(connectingSegment.end)) {
    return new Segment(connectingSegment.end, connectingSegment.begin)
  }
  throw new Error("Segments don't connect")
}

function createClosingSegment(segment: Segment, connectingSegment: Segment) {
  if (segment.begin.equals(connectingSegment.begin)) {
    return new Segment(connectingSegment.end, segment.end)
  } else if (segment.begin.equals(connectingSegment.end)) {
    return new Segment(connectingSegment.begin, segment.end)
  } else if (segment.end.equals(connectingSegment.begin)) {
    return new Segment(connectingSegment.end, segment.begin)
  } else if (segment.end.equals(connectingSegment.end)) {
    return new Segment(connectingSegment.begin, segment.begin)
  }
  throw new Error("Segments don't connect")
}
