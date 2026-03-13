import {Scene} from "./scenes"
import {Model, Point, Size, SpaceModel} from "../models"
import {ModelObject} from "../objects/modelObject"
import {subtractTriangleTestCases1} from "../../tests/operations/subtractTriangleTestCases1"

export function subtractTriangle1(): Scene {

  let count = 0;

  function testSpaceModel(model: Model, position: Point) {
    const spaceModel = new SpaceModel(model, position, Size.quarter)
    return new ModelObject("model." + count++, spaceModel)
  }

  return new Scene("subtract triangles 1", [
    testSpaceModel(subtractTriangleTestCases1.intersect1_segmentBC(), new Point(-1, .5,0)),
    testSpaceModel(subtractTriangleTestCases1.intersect2_2pointCA(), new Point(-.5, .5,0)),
    testSpaceModel(subtractTriangleTestCases1.intersect3_1pointCA(), new Point(0, .5, 0)),
    testSpaceModel(subtractTriangleTestCases1.intersect4_no(), new Point(.5, .5, 0)),
    testSpaceModel(subtractTriangleTestCases1.intersect5_1pointBC_CA(), new Point(1, .5, 0)),
    testSpaceModel(subtractTriangleTestCases1.intersect6_1pointBCSegmentCA(), new Point(-.5, -.25,0)),
    testSpaceModel(subtractTriangleTestCases1.intersect7_2pointsBC(), new Point(0, -.25,0)),
    testSpaceModel(subtractTriangleTestCases1.intersect8_1pointBC(), new Point(.5, -.25,0)),
    testSpaceModel(subtractTriangleTestCases1.intersect9_noTriangleAbove(), new Point(1, -.25,0)),
  ])
}
