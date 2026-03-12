import {Line, Point, Segment} from "../models"
import {
  SegmentIntersection,
  NoIntersection,
  noIntersection,
  PointIntersection
} from "./intersectionResult"
import {CoordinateSystem} from "./coordinateSystem"
import {equalsTolerance, equalsTolerancePoint, greaterTolerance, smallerTolerance} from "../models/equals"

export function intersectionSegments(lineSegment1: Segment, lineSegment2: Segment, sourceSegments: readonly Segment[]): SegmentIntersection | PointIntersection | NoIntersection {

  if (lineSegment1.equals(lineSegment2)) {
    return new SegmentIntersection(lineSegment1,[lineSegment1])
  }

  const line1 = lineSegment1.line()
  const line2 = lineSegment2.line()

  if (lineSegment1.belongsToLine(line2) || lineSegment2.belongsToLine(line1)) {

    // Segments are collinear

    // Create local CS with X-axis along segment 's'
    const v2 = lineSegment2.vector().orthogonalVector()
    const cs = new CoordinateSystem(lineSegment2.begin, lineSegment2.vector(), v2)
    const x1 = 0.0
    const x2 = lineSegment2.length()

    const t3 = cs.convert(lineSegment1.begin).x
    const t4 = cs.convert(lineSegment1.end).x
    const x3 = Math.min(t3, t4)
    const x4 = Math.max(t3, t4)

    // Segments do not overlap
    if (smallerTolerance(x4, x1) || greaterTolerance(x3, x2)) {
      return noIntersection
    }

    // One common point
    if (equalsTolerance(Math.max(x3, x4), x1)) {
      return new PointIntersection(cs.toGlobal(new Point(x1, 0, 0)))
    }
    if (equalsTolerance(Math.min(x3, x4), x2)) {
      return new PointIntersection(cs.toGlobal(new Point(x2, 0, 0)))
    }

    // Overlapping segments
    const overlapX1 = Math.max(x1, x3)
    const overlapX2 = Math.min(x2, x4)
    const overlapBegin = cs.toGlobal(new Point(overlapX1, 0, 0))
    const overlapEnd = cs.toGlobal(new Point(overlapX2, 0, 0))

    if (equalsTolerancePoint(overlapEnd, lineSegment1.begin) || equalsTolerancePoint(overlapBegin, lineSegment1.end)) {
      return new SegmentIntersection(new Segment(overlapEnd, overlapBegin), sourceSegments)
    } else {
      return new SegmentIntersection(new Segment(overlapBegin, overlapEnd), sourceSegments)
    }
  } else {
    const perpendicular = line1.perpendicularTo(line2)
    if (perpendicular != null && perpendicular.belongsTo(lineSegment1) && perpendicular.belongsTo(lineSegment2)) {
      return new PointIntersection(perpendicular)
    } else {
      return noIntersection
    }
  }
}

export function intersectionSegmentLine(segment: Segment, line: Line): PointIntersection | SegmentIntersection | NoIntersection {

  if (segment.belongsToLine(line)) {
    return new SegmentIntersection(segment, [])
  }

  const point = line.perpendicularTo(segment.line());
  if (point != null && point.belongsTo(segment) && point.belongsToLine(line)) {
    return new PointIntersection(point)
  } else {
    return noIntersection;
  }
}
