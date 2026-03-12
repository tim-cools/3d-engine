import {Point} from "../../engine/models"
import {Nothing} from "../../engine/nothing"
import {subtractTriangle} from "./subtractTriangleTestCases1"

//TriangleModel.create(Point.null, new Point(1, 0, 0), new Point(0, 1, 0))

export const subtractTriangleTestCases3 = {
  intersect1_point1(position: Point | Nothing = null) {
    return subtractTriangle(new Point(0, 0, 0), new Point(-1, 0, 0), new Point(0, -1, 0), position)
  },
  intersect2_segmentAC_line(position: Point | Nothing = null) {
    return subtractTriangle(new Point(0, .25, 0), new Point(-1, .25, 0), new Point(0, -.75, 0), position)
  },
  intersect3_segmentAC_cornerAB_line(position: Point | Nothing = null) {
    return subtractTriangle(new Point(.25, 0, 0), new Point(-.75, 0, 0), new Point(-.75, -1, 0), position)
  },

  intersect4_point2(position: Point | Nothing = null) {
    return subtractTriangle(new Point(1, 0, 0), new Point(2, 0, 0), new Point(2, -1, 0), position)
  },
  intersect5_segmentBC_line(position: Point | Nothing = null) {
    return subtractTriangle(new Point(.75, .25, 0), new Point(1.75, .25, 0), new Point(1.75, -.75, 0), position)
  },
  intersect6_segmentAB_line(position: Point | Nothing = null) {
    return subtractTriangle(new Point(.75, 0, 0), new Point(1.75, 0, 0), new Point(1.75, -1, 0), position)
  },

  intersect7_point3(position: Point | Nothing = null) {
    return subtractTriangle(new Point(-1, 1, 0), new Point(0, 1, 0), new Point(0, 2, 0), position)
  },
  intersect8_segmentBC_line(position: Point | Nothing = null) {
    return subtractTriangle(new Point(-1, .75, 0), new Point(0, .75, 0), new Point(0, 1.75, 0), position)
  },
  intersect9_segmentCA_line(position: Point | Nothing = null) {
    return subtractTriangle(new Point(.25, .75, 0), new Point(.25, 1.75, 0), new Point(-.75, 1.75, 0), position)
  },
}
