import {Scene} from "./scenes"
import {Model, Point, Size, SpaceModel, Transformer, Triangle} from "../models"
import {ModelObject} from "../objects/modelObject"
import {UpdatableShape} from "../shapes"
import {nothing, Nothing} from "../nothing"
import {subtractTriangleTestCases4} from "../../tests/operations/subtractTriangleTestCases4"

function debugModel(point: Point): SpaceModel {

  const faces = [
    new Triangle(new Point(0.00000, 0.00000, 1.00000), new Point(0.00000, 0.50000, 1.00000), new Point(0.50000, 0.00000, 1.00000)),
    new Triangle(new Point(1.00000, 1.00000, 1.00000), new Point(0.50000, 0.75000, 1.00000), new Point(0.50000, 0.50000, 1.00000)),
  ]

  const model = new Model([], [], faces, () => false, () => false)
  return new SpaceModel(model, point, Size.quarter);
}

export function subtractTriangle4(): Scene {

  let count = 0;

  function model(model: SpaceModel, debugShapes: ((translate: Transformer) => readonly UpdatableShape[]) | Nothing = nothing) {
    return new ModelObject("model." + count++, model, debugShapes)
  }

  return new Scene("subtract triangles 2", [
    model(subtractTriangleTestCases4.intersect1_skewedTriangle(new Point(-1, .5, 0))),
    model(subtractTriangleTestCases4.intersect2_outsideTriangle(new Point(-.5, .5, 0))),
    model(subtractTriangleTestCases4.intersect3_skewedTriangle(new Point(0, .5, 0))),

    model(subtractTriangleTestCases4.intersect4_skewedTriangle(new Point(-1, -.25, 0))),
    model(subtractTriangleTestCases4.intersect5_outsideTriangle(new Point(-.5, -.25, 0))),
    model(subtractTriangleTestCases4.intersect6_skewedTriangle(new Point(0, -.25, 0))),

    model(debugModel(new Point(.5, -.25,0))),
  ])
}
