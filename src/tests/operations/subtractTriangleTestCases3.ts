import {Point} from "../../engine/models"
import {Nothing} from "../../engine/nothing"
import {subtractTriangle} from "./subtractTriangleTestCases1"

//TriangleModel.create(Point.null, new Point(1, 0, 0), new Point(0, 1, 0))

export const subtractTriangleTestCases3 = {
  intersect1_point1() {
    return subtractTriangle(new Point(0, 0, 0), new Point(-1, 0, 0), new Point(0, -1, 0))
  },
  intersect2_segmentAC_line() {
    return subtractTriangle(new Point(0, .25, 0), new Point(-1, .25, 0), new Point(0, -.75, 0))
  },
  intersect3_segmentAC_cornerAB_line() {
    return subtractTriangle(new Point(.25, 0, 0), new Point(-.75, 0, 0), new Point(-.75, -1, 0))
  },

  intersect4_point2() {
    return subtractTriangle(new Point(1, 0, 0), new Point(2, 0, 0), new Point(2, -1, 0))
  },
  intersect5_segmentBC_line() {
    return subtractTriangle(new Point(.75, .25, 0), new Point(1.75, .25, 0), new Point(1.75, -.75, 0))
  },
  intersect6_segmentAB_line() {
    return subtractTriangle(new Point(.75, 0, 0), new Point(1.75, 0, 0), new Point(1.75, -1, 0))
  },

  intersect7_point3() {
    return subtractTriangle(new Point(-1, 1, 0), new Point(0, 1, 0), new Point(0, 2, 0))
  },
  intersect8_segmentBC_line() {
    return subtractTriangle(new Point(-1, .75, 0), new Point(0, .75, 0), new Point(0, 1.75, 0))
  },
  intersect9_segmentCA_line() {
    return subtractTriangle(new Point(.25, .75, 0), new Point(.25, 1.75, 0), new Point(-.75, 1.75, 0))
  },
}
