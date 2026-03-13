import {Scene} from "./scenes"
import {Model, Point, Size, SpaceModel} from "../models"
import {ModelObject} from "../objects/modelObject"
import {subtractTriangleTestCases3} from "../../tests/operations/subtractTriangleTestCases3"

export function subtractTriangle3(): Scene {

  let count = 0;

  function testSpaceModel(model: Model, position: Point) {
    const spaceModel = new SpaceModel(model, position, Size.quarter)
    return new ModelObject("model." + count++, spaceModel)
  }

  return new Scene("subtract triangles 3", [
    testSpaceModel(subtractTriangleTestCases3.intersect1_point1(), new Point(-1, .5,0)),
    testSpaceModel(subtractTriangleTestCases3.intersect2_segmentAC_line(), new Point(-.5, .5,0)),
    testSpaceModel(subtractTriangleTestCases3.intersect3_segmentAC_cornerAB_line(), new Point(0, .5, 0)),

    testSpaceModel(subtractTriangleTestCases3.intersect4_point2(), new Point(.5, .5,0)),
    testSpaceModel(subtractTriangleTestCases3.intersect5_segmentBC_line(), new Point(1, .5,0)),
    testSpaceModel(subtractTriangleTestCases3.intersect6_segmentAB_line(), new Point(-1, -.25, 0)),

    testSpaceModel(subtractTriangleTestCases3.intersect7_point3(), new Point(-.5, -.25,0)),
    testSpaceModel(subtractTriangleTestCases3.intersect8_segmentBC_line(), new Point(0, -.25,0)),
    testSpaceModel(subtractTriangleTestCases3.intersect9_segmentCA_line(), new Point(.5, -.25, 0)),
  ])
}
