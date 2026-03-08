//adaption from GeometRi by Sergey Tarasov
import {Line, Segment, Plane, Triangle, Vector} from "../models"
import {equalsTolerance, equalsTolerancePoint, greaterTolerance, smallerTolerance, tolerance} from "../models/equals"
import {Point} from "../models"

export enum Intersection {
  None,
  Point,
  Line,
  Segment,
  Triangle,
  Plane
}

export const noIntersection: NoIntersection = {
  type: Intersection.None
}

export type NoIntersection = {
  type: Intersection.None
}

export type PointIntersection = {
  type: Intersection.Point,
  point: Point
}

export type LineIntersection = {
  type: Intersection.Line,
  line: Line
}

export type SegmentIntersection = {
  type: Intersection.Segment,
  segment: Segment,
  sourceSegments: readonly Segment[]
}

export type TriangleIntersection = {
  type: Intersection.Triangle,
  triangle: Triangle
}

export type PlaneIntersection = {
  type: Intersection.Plane,
  plane: Plane
}
