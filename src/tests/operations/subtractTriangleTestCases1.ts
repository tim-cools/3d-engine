import {Point, Size, SpaceModel, SubtractModel, Triangle} from "../../engine/models"
import {TriangleModel} from "../../engine/models/triangleModel"
import {Nothing} from "../../engine/nothing"

export function subtractTriangle(point1: Point, point2: Point, point3: Point, position: Point | Nothing): SpaceModel {
  const triangle = TriangleModel.create(Point.null, new Point(1, 0, 0), new Point(0, 1, 0))
  const subtract = TriangleModel.create(point1, point2, point3)
  const subtractSpace = new SpaceModel(subtract, Point.null, Size.default)
  return SubtractModel.create(triangle, subtractSpace, position ?? Point.null, Size.quarter)
}

export const subtractTriangleTestCases1 = {
  intersect1_segmentBC(position: Point | Nothing = null) {
    return subtractTriangle(new Point(.5, -.5, 0), new Point(1.5, -.5, 0), new Point(.5, .5, 0), position)
  },
  intersect2_2pointCA(position: Point | Nothing = null) {
    return subtractTriangle(new Point(.5, -.75, 0), new Point(1.5, -.75, 0), new Point(.5, .25, 0), position)
  },
  intersect3_1pointCA(position: Point | Nothing = null) {
    return subtractTriangle(new Point(.5, -1, 0), new Point(1.5, -1, 0), new Point(.5, 0, 0), position)
  },
  intersect4_no(position: Point | Nothing = null) {
    return subtractTriangle(new Point(.5, -1.25, 0), new Point(1.5, -1.25, 0), new Point(.5, -.25, 0), position)
  },
  intersect5_1pointBC_CA(position: Point | Nothing = null) {
    return subtractTriangle(new Point(.5, -.25, 0), new Point(1.5, -.25, 0), new Point(.5, .75, 0), position)
  },
  intersect6_1pointBCSegmentCA(position: Point | Nothing = null) {
    return subtractTriangle(new Point(.5, .0, 0), new Point(1.5, 0, 0), new Point(.5, 1, 0), position)
  },
  intersect7_2pointsBC(position: Point | Nothing = null) {
    return subtractTriangle(new Point(.5, .25, 0), new Point(1.5, .25, 0), new Point(.5, 1.25, 0), position)
  },
  intersect8_1pointBC(position: Point | Nothing = null) {
    return subtractTriangle(new Point(.5, .5, 0), new Point(1.5, .5, 0), new Point(.5, 1.5, 0), position)
  },
  intersect9_noTriangleAbove(position: Point | Nothing = null) {
    return subtractTriangle(new Point(.5, .75, 0), new Point(1.5, .75, 0), new Point(.5, 1.75, 0), position)
  },
}
