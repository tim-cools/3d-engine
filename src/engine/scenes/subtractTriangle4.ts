import {Scene} from "./scenes"
import {Model, Point, Size, SpaceModel, Triangle} from "../models"
import {subtractTriangleTestCases4} from "../../tests/operations/subtractTriangleTestCases4"
import {ModelObject, Object} from "../objects"
import {Lazy} from "../../infrastructure/lazy"
import {SubtractModelObject} from "../objects/subtractModelObject"
import {SubtractModels} from "../intersections"

function debugModel(position: Point): ModelObject {

  const faces = [
    new Triangle(new Point(0.00000, 0.00000, 1.00000), new Point(0.00000, 0.50000, 1.00000), new Point(0.50000, 0.00000, 1.00000)),
    new Triangle(new Point(1.00000, 1.00000, 1.00000), new Point(0.50000, 0.75000, 1.00000), new Point(0.50000, 0.50000, 1.00000)),
  ]

  let model = new Model([], [], faces, () => false, () => false)
  return new ModelObject("debug", new SpaceModel(model, position, Size.quarter))
}

export function subtractTriangle4(): Scene {

  let count = 0;

  function model(models: SubtractModels, position: Point) {
    return new SubtractModelObject("model." + count++, models, position, Size.quarter)
  }

  return new Scene("subtract triangles 2", new Lazy<Object[]>(() => [
    model(subtractTriangleTestCases4.intersect1_skewedTriangle(), new Point(-1, .5, 0)),
    model(subtractTriangleTestCases4.intersect2_outsideTriangle(), new Point(-.5, .5, 0)),
    model(subtractTriangleTestCases4.intersect3_skewedTriangle(), new Point(0, .5, 0)),

    model(subtractTriangleTestCases4.intersect4_skewedTriangle(), new Point(-1, -.25, 0)),
    model(subtractTriangleTestCases4.intersect5_outsideTriangle(), new Point(-.5, -.25, 0)),
    model(subtractTriangleTestCases4.intersect6_skewedTriangle(), new Point(0, -.25, 0)),

    debugModel(new Point(.5, -.25,0)),
  ]))
}
