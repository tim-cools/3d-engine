import {Point, Size} from "../models"
import {subtractTriangleTestCases3} from "../../tests/intersections/subtractTriangleTestCases3"
import {SubtractModelObject} from "../objects/subtractModelObject"
import {SubtractModels} from "../intersections"
import {ApplicationContext} from "../applicationContext"
import {Scene} from "./scene"

export function subtractTriangle3(): Scene {

  return new Scene("Subtract triangles 3", (context: ApplicationContext) => {

    let count = 0;

    function testSpaceModel(models: SubtractModels, position: Point) {
      return new SubtractModelObject(context, "model." + count++, models, position, Size.quarter)
    }

    return [
      testSpaceModel(subtractTriangleTestCases3.intersect1_point1(), new Point(-1, .5, 0)),
      testSpaceModel(subtractTriangleTestCases3.intersect2_segmentAC_line(), new Point(-.5, .5, 0)),
      testSpaceModel(subtractTriangleTestCases3.intersect3_segmentAC_cornerAB_line(), new Point(0, .5, 0)),

      testSpaceModel(subtractTriangleTestCases3.intersect4_point2(), new Point(.5, .5, 0)),
      testSpaceModel(subtractTriangleTestCases3.intersect5_segmentBC_line(), new Point(1, .5, 0)),
      testSpaceModel(subtractTriangleTestCases3.intersect6_segmentAB_line(), new Point(-1, -.25, 0)),

      testSpaceModel(subtractTriangleTestCases3.intersect7_point3(), new Point(-.5, -.25, 0)),
      testSpaceModel(subtractTriangleTestCases3.intersect8_segmentBC_line(), new Point(0, -.25, 0)),
      testSpaceModel(subtractTriangleTestCases3.intersect9_segmentCA_line(), new Point(.5, -.25, 0)),
    ]
  })
}
