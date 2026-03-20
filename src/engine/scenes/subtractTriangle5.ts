import {Scene} from "./scenes"
import {Point, Size} from "../models"
import {subtractTriangleTestCases5} from "../../tests/operations/subtractTriangleTestCases5"
import {Object} from "../objects"
import {Lazy} from "../../infrastructure/lazy"
import {SubtractModelObject} from "../objects/subtractModelObject"
import {SubtractModels} from "../intersections/subtractModels"

export function subtractTriangle5(): Scene {

  let count = 0;

  function model(models: SubtractModels, position: Point) {
    return new SubtractModelObject("model." + count++, models, position, Size.quarter)
  }

  return new Scene("subtract triangles 2", new Lazy<Object[]>(() => [
    model(subtractTriangleTestCases5.intersect1_side(), new Point(-1, .5, 0)),
    model(subtractTriangleTestCases5.intersect2_perpendicular(), new Point(0, .5, 0)),
    /*
    model(subtractTriangleTestCases4.intersect3_skewedTriangle(), new Point(0, .5, 0)),

    model(subtractTriangleTestCases4.intersect4_skewedTriangle(), new Point(-1, -.25, 0)),
    model(subtractTriangleTestCases4.intersect5_outsideTriangle(), new Point(-.5, -.25, 0)),
    model(subtractTriangleTestCases4.intersect6_skewedTriangle(), new Point(0, -.25, 0)),
    */
  ]))
}
