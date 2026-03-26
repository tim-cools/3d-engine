import {Point, Size} from "../models"
import {subtractTriangleTestCases5} from "../../tests/intersections/subtractTriangleTestCases5"
import {SubtractModelObject} from "../objects/subtractModelObject"
import {SubtractModels} from "../intersections"
import {ApplicationContext} from "../applicationContext"
import {Scene} from "./scene"

export function subtractTriangle5(): Scene {

  return new Scene("Subtract triangles 5", (context: ApplicationContext) => {

    let count = 0;

    function model(models: SubtractModels, position: Point) {
      return new SubtractModelObject(context,"model." + count++, models, position, Size.quarter)
    }

    return [
      model(subtractTriangleTestCases5.intersect1_side(), new Point(-1, .5, 0)),
      model(subtractTriangleTestCases5.intersect2_perpendicular(), new Point(0, .5, 0)),
      /*
      model(subtractTriangleTestCases4.intersect3_skewedTriangle(), new Point(0, .5, 0)),

      model(subtractTriangleTestCases4.intersect4_skewedTriangle(), new Point(-1, -.25, 0)),
      model(subtractTriangleTestCases4.intersect5_outsideTriangle(), new Point(-.5, -.25, 0)),
      model(subtractTriangleTestCases4.intersect6_skewedTriangle(), new Point(0, -.25, 0)),
      */
    ]
  })
}
