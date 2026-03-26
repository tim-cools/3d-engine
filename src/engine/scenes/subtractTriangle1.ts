import {Point, Size} from "../models"
import {subtractTriangleTestCases1} from "../../tests/intersections/subtractTriangleTestCases1"
import {SubtractModelObject} from "../objects/subtractModelObject"
import {SubtractModels} from "../intersections"
import {ApplicationContext} from "../applicationContext"
import {Scene} from "./scene"

export function subtractTriangle1(): Scene {

  return new Scene("Subtract triangles 1", (context: ApplicationContext) => {

    let count = 0;

    function testSpaceModel(models: SubtractModels, position: Point) {
      return new SubtractModelObject(context, "model." + count++, models, position, Size.quarter)
    }

    return [
      testSpaceModel(subtractTriangleTestCases1.intersect1_segmentBC(), new Point(-1, .5, 0)),
      testSpaceModel(subtractTriangleTestCases1.intersect2_2pointCA(), new Point(-.5, .5, 0)),
      testSpaceModel(subtractTriangleTestCases1.intersect3_1pointCA(), new Point(0, .5, 0)),
      testSpaceModel(subtractTriangleTestCases1.intersect4_no(), new Point(.5, .5, 0)),
      testSpaceModel(subtractTriangleTestCases1.intersect5_1pointBC_CA(), new Point(1, .5, 0)),
      testSpaceModel(subtractTriangleTestCases1.intersect6_1pointBCSegmentCA(), new Point(-.5, -.25, 0)),
      testSpaceModel(subtractTriangleTestCases1.intersect7_2pointsBC(), new Point(0, -.25, 0)),
      testSpaceModel(subtractTriangleTestCases1.intersect8_1pointBC(), new Point(.5, -.25, 0)),
      testSpaceModel(subtractTriangleTestCases1.intersect9_noTriangleAbove(), new Point(1, -.25, 0)),
    ]
  })
}
