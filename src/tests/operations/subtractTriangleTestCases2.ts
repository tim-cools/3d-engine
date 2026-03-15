import {Point} from "../../engine/models"
import {subtractTriangle} from "./subtractTriangleTestCases1"

//TriangleModel.create(Point.null, new Point(1, 0, 0), new Point(0, 1, 0))

export const subtractTriangleTestCases2 = {
  intersect1_point1() {
    return subtractTriangle(new Point(-.5, -.5, 0), new Point(0.5, -.5, 0), new Point(-.5, .5, 0))
  },
  intersect2_segmentAC_line() {
    return subtractTriangle(new Point(-.25, -.25, 0), new Point(0.75, -.25, 0), new Point(-.25, .75, 0))
  },
  intersect3_segmentAC_corner() {
    return subtractTriangle(new Point(.5, .5, 0), new Point(0.5, -.5, 0), new Point(-.5, .5, 0))
  },

  intersect4_point2() {
    return subtractTriangle(new Point(.5, -.5, 0), new Point(1.5, -.5, 0), new Point(1.5, .5, 0))
  },
  intersect5_segmentAB_line() {
    return subtractTriangle(new Point(.25, -.25, 0), new Point(1.25, -0.25, 0), new Point(1.25, .75, 0))
  },
  intersect6_segmentAB_corner() {
    return subtractTriangle(new Point(.5, -.75, 0), new Point(.5, .25, 0), new Point(1.5, .25, 0))
  },

  intersect7_point3() {
    return subtractTriangle(new Point(-.5, .5, 0), new Point(0.5, 1.5, 0), new Point(-.5, 1.5, 0))
  },
  intersect8_segmentBC_line() {
    return subtractTriangle(new Point(-.25, .25, 0), new Point(0.75, 1.25, 0), new Point(-.25, 1.25, 0))
  },
  intersect9_segmentBC_corner() {
    return subtractTriangle(new Point(-.75, .5, 0), new Point(.25, .5, 0), new Point(.25, 1.5, 0))
  },
}
