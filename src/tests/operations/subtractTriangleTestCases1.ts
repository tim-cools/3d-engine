import {Point, Size, SpaceModel, SubtractModel} from "../../engine/models"
import {TriangleModel} from "../../engine/models/triangleModel"

export function subtractTriangle(point1: Point, point2: Point, point3: Point): SubtractModel {
  const triangle = TriangleModel.create(Point.null, new Point(1, 0, 0), new Point(0, 1, 0))
  const subtract = TriangleModel.create(point1, point2, point3)
  const subtractSpace = new SpaceModel(subtract, Point.null, Size.default)
  return SubtractModel.create(triangle, subtractSpace)
}

export const subtractTriangleTestCases1 = {
  intersect1_segmentBC() {
    return subtractTriangle(new Point(.5, -.5, 0), new Point(1.5, -.5, 0), new Point(.5, .5, 0))
  },
  intersect2_2pointCA() {
    return subtractTriangle(new Point(.5, -.75, 0), new Point(1.5, -.75, 0), new Point(.5, .25, 0))
  },
  intersect3_1pointCA() {
    return subtractTriangle(new Point(.5, -1, 0), new Point(1.5, -1, 0), new Point(.5, 0, 0))
  },
  intersect4_no() {
    return subtractTriangle(new Point(.5, -1.25, 0), new Point(1.5, -1.25, 0), new Point(.5, -.25, 0))
  },
  intersect5_1pointBC_CA() {
    return subtractTriangle(new Point(.5, -.25, 0), new Point(1.5, -.25, 0), new Point(.5, .75, 0))
  },
  intersect6_1pointBCSegmentCA() {
    return subtractTriangle(new Point(.5, .0, 0), new Point(1.5, 0, 0), new Point(.5, 1, 0))
  },
  intersect7_2pointsBC() {
    return subtractTriangle(new Point(.5, .25, 0), new Point(1.5, .25, 0), new Point(.5, 1.25, 0))
  },
  intersect8_1pointBC() {
    return subtractTriangle(new Point(.5, .5, 0), new Point(1.5, .5, 0), new Point(.5, 1.5, 0))
  },
  intersect9_noTriangleAbove() {
    return subtractTriangle(new Point(.5, .75, 0), new Point(1.5, .75, 0), new Point(.5, 1.75, 0))
  },
}
