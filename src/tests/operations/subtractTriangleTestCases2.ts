import {Point} from "../../engine/models"
import {Nothing} from "../../engine/nothing"
import {subtractTriangle} from "./subtractTriangleTestCases1"

//TriangleModel.create(Point.null, new Point(1, 0, 0), new Point(0, 1, 0))

export const subtractTriangleTestCases2 = {
  intersect1_point1(position: Point | Nothing = null) {
    return subtractTriangle(new Point(-.5, -.5, 0), new Point(0.5, -.5, 0), new Point(-.5, .5, 0), position)
  },
  intersect2_segmentAC_line(position: Point | Nothing = null) {
    return subtractTriangle(new Point(-.25, -.25, 0), new Point(0.75, -.25, 0), new Point(-.25, .75, 0), position)
  },
  intersect3_segmentAC_corner(position: Point | Nothing = null) {
    return subtractTriangle(new Point(.5, .5, 0), new Point(0.5, -.5, 0), new Point(-.5, .5, 0), position)
  },

  intersect4_point2(position: Point | Nothing = null) {
    return subtractTriangle(new Point(.5, -.5, 0), new Point(1.5, -.5, 0), new Point(1.5, .5, 0), position)
  },
  intersect5_segmentAB_line(position: Point | Nothing = null) {
    return subtractTriangle(new Point(.25, -.25, 0), new Point(1.25, -0.25, 0), new Point(1.25, .75, 0), position)
  },
  intersect6_segmentAB_corner(position: Point | Nothing = null) {
    return subtractTriangle(new Point(.5, -.75, 0), new Point(.5, .25, 0), new Point(1.5, .25, 0), position)
  },

  intersect7_point3(position: Point | Nothing = null) {
    return subtractTriangle(new Point(-.5, .5, 0), new Point(0.5, 1.5, 0), new Point(-.5, 1.5, 0), position)
  },
  intersect8_segmentBC_line(position: Point | Nothing = null) {
    return subtractTriangle(new Point(-.25, .25, 0), new Point(0.75, 1.25, 0), new Point(-.25, 1.25, 0), position)
  },
  intersect9_segmentBC_corner(position: Point | Nothing = null) {
    return subtractTriangle(new Point(-.75, .5, 0), new Point(.25, .5, 0), new Point(.25, 1.5, 0), position)
  },
}
