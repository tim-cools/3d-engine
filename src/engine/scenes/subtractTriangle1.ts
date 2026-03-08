import {Scene} from "./scenes"
import {Point, Size, SpaceModel, SubtractModel} from "../models"
import {ModelObject} from "../objects/modelObject"
import {subtractTriangleTestCases} from "../../tests/operations/subtractTriangleTestCases"

export function subtractTriangle1(): Scene {

  let count = 0;

  function triangle(model: SpaceModel) {
    return new ModelObject("model." + count++, model)
  }

  return new Scene("subtract triangles 1", [
    triangle(subtractTriangleTestCases.intersect1_segmentBC(new Point(-1, .5,0))),
    triangle(subtractTriangleTestCases.intersect2_2pointCA(new Point(-.5, .5,0))),
    triangle(subtractTriangleTestCases.intersect3_1pointCA(new Point(0, .5, 0))),
    triangle(subtractTriangleTestCases.intersect4_no(new Point(.5, .5, 0))),
    triangle(subtractTriangleTestCases.intersect5_1pointBC_CA(new Point(1, .5, 0))),
    triangle(subtractTriangleTestCases.intersect6_1pointBCSegmentCA(new Point(-.5, -.25,0))),
    triangle(subtractTriangleTestCases.intersect7_2pointsBC(new Point(0, -.25,0))),
    triangle(subtractTriangleTestCases.intersect8_1pointBC(new Point(.5, -.25,0))),
    triangle(subtractTriangleTestCases.intersect9_noTriangleAbove(new Point(1, -.25,0))),
  ])
}
