import {Model, Point, Size, SpaceModel, Triangle} from "../models"
import {subtractTriangleTestCases4} from "../../tests/intersections/subtractTriangleTestCases4"
import {ModelObject} from "../objects"
import {SubtractModelObject} from "../objects/subtractModelObject"
import {SubtractModels} from "../intersections"
import {ApplicationContext} from "../applicationContext"
import {Scene} from "./scene"

export function subtractTriangle4(): Scene {

  return new Scene("Subtract triangles 4", (context: ApplicationContext) => {

    let count = 0;

    function debugModel(position: Point): ModelObject {

      const faces = [
        new Triangle(new Point(0.00000, 0.00000, 1.00000), new Point(0.00000, 0.50000, 1.00000), new Point(0.50000, 0.00000, 1.00000)),
        new Triangle(new Point(1.00000, 1.00000, 1.00000), new Point(0.50000, 0.75000, 1.00000), new Point(0.50000, 0.50000, 1.00000)),
      ]

      let model = new Model([], [], faces, () => false, () => false)
      return new ModelObject(context, "debug", new SpaceModel(model, position, Size.quarter))
    }

    function model(models: SubtractModels, position: Point) {
      return new SubtractModelObject(context, "model." + count++, models, position, Size.quarter)
    }

    return [
      model(subtractTriangleTestCases4.intersect1_skewedTriangle(), new Point(-1, .5, 0)),
      model(subtractTriangleTestCases4.intersect2_outsideTriangle(), new Point(-.5, .5, 0)),
      model(subtractTriangleTestCases4.intersect3_skewedTriangle(), new Point(0, .5, 0)),

      model(subtractTriangleTestCases4.intersect4_skewedTriangle(), new Point(-1, -.25, 0)),
      model(subtractTriangleTestCases4.intersect5_outsideTriangle(), new Point(-.5, -.25, 0)),
      model(subtractTriangleTestCases4.intersect6_skewedTriangle(), new Point(0, -.25, 0)),

      debugModel(new Point(.5, -.25, 0)),
    ]
  })
}
