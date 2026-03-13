import {Scene} from "./scenes"
import {Model, Point, Size, SpaceModel} from "../models"
import {ModelObject} from "../objects/modelObject"
import {subtractTriangleTestCases2} from "../../tests/operations/subtractTriangleTestCases2"

export function subtractTriangle2(): Scene {

  let count = 0;

  function testSpaceModel(model: Model, position: Point) {
    const spaceModel = new SpaceModel(model, position, Size.quarter)
    return new ModelObject("model." + count++, spaceModel)
  }

  return new Scene("subtract triangles 2", [
    testSpaceModel(subtractTriangleTestCases2.intersect1_point1(), new Point(-1, .5,0)),
    testSpaceModel(subtractTriangleTestCases2.intersect2_segmentAC_line(), new Point(-.5, .5,0)),
    testSpaceModel(subtractTriangleTestCases2.intersect3_segmentAC_corner(), new Point(0, .5, 0)),

    testSpaceModel(subtractTriangleTestCases2.intersect4_point2(), new Point(.5, .5,0)),
    testSpaceModel(subtractTriangleTestCases2.intersect5_segmentAB_line(), new Point(1, .5,0)),
    testSpaceModel(subtractTriangleTestCases2.intersect6_segmentAB_corner(), new Point(-1, -.25, 0)),

    testSpaceModel(subtractTriangleTestCases2.intersect7_point3(), new Point(-.5, -.25,0)),
    testSpaceModel(subtractTriangleTestCases2.intersect8_segmentBC_line(), new Point(0, -.25,0)),
    testSpaceModel(subtractTriangleTestCases2.intersect9_segmentBC_corner(), new Point(.5, -.25, 0))
  ])
}
