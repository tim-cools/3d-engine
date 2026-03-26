import {Point, Size} from "../models"
import {subtractTriangleTestCases2} from "../../tests/intersections/subtractTriangleTestCases2"
import {SubtractModelObject} from "../objects/subtractModelObject"
import {SubtractModels} from "../intersections"
import {ApplicationContext} from "../applicationContext"
import {Scene} from "./scene"

export function subtractTriangle2(): Scene {

  return new Scene("Subtract triangles 2", (context: ApplicationContext) => {

    let count = 0;

    function testSpaceModel(models: SubtractModels, position: Point) {
      return new SubtractModelObject(context, "model." + count++, models, position, Size.quarter)
    }

    return [
      testSpaceModel(subtractTriangleTestCases2.intersect1_point1(), new Point(-1, .5, 0)),
      testSpaceModel(subtractTriangleTestCases2.intersect2_segmentAC_line(), new Point(-.5, .5, 0)),
      testSpaceModel(subtractTriangleTestCases2.intersect3_segmentAC_corner(), new Point(0, .5, 0)), //<<<

      testSpaceModel(subtractTriangleTestCases2.intersect4_point2(), new Point(.5, .5, 0)),
      testSpaceModel(subtractTriangleTestCases2.intersect5_segmentAB_line(), new Point(1, .5, 0)),     //<<<
      testSpaceModel(subtractTriangleTestCases2.intersect6_segmentAB_corner(), new Point(-1, -.25, 0)),      //<<<

      testSpaceModel(subtractTriangleTestCases2.intersect7_point3(), new Point(-.5, -.25, 0)),
      testSpaceModel(subtractTriangleTestCases2.intersect8_segmentBC_line(), new Point(0, -.25, 0)),
      testSpaceModel(subtractTriangleTestCases2.intersect9_segmentBC_corner(), new Point(.5, -.25, 0))     //<<<
    ]
  })
}
