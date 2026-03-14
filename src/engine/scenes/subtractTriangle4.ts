import {Scene} from "./scenes"
import {Model, Point, Size, SpaceModel, Triangle} from "../models"
import {subtractTriangleTestCases4} from "../../tests/operations/subtractTriangleTestCases4"
import {Object, ModelObject} from "../objects"
import {Lazy} from "../../infrastructure/lazy"

function debugModel(): Model {

  const faces = [
    new Triangle(new Point(0.00000, 0.00000, 1.00000), new Point(0.00000, 0.50000, 1.00000), new Point(0.50000, 0.00000, 1.00000)),
    new Triangle(new Point(1.00000, 1.00000, 1.00000), new Point(0.50000, 0.75000, 1.00000), new Point(0.50000, 0.50000, 1.00000)),
  ]

  return new Model([], [], faces, () => false, () => false)
}

export function subtractTriangle4(): Scene {

  let count = 0;

  function model(model: Model, position: Point) {
    const spaceModel = new SpaceModel(model, position, Size.quarter)
    return new ModelObject("model." + count++, spaceModel)
  }

  return new Scene("subtract triangles 2", new Lazy<Object[]>(() => [
    model(subtractTriangleTestCases4.intersect1_skewedTriangle(), new Point(-1, .5, 0)),
    model(subtractTriangleTestCases4.intersect2_outsideTriangle(), new Point(-.5, .5, 0)),
    model(subtractTriangleTestCases4.intersect3_skewedTriangle(), new Point(0, .5, 0)),

    model(subtractTriangleTestCases4.intersect4_skewedTriangle(), new Point(-1, -.25, 0)),
    model(subtractTriangleTestCases4.intersect5_outsideTriangle(), new Point(-.5, -.25, 0)),
    model(subtractTriangleTestCases4.intersect6_skewedTriangle(), new Point(0, -.25, 0)),

    model(debugModel(), new Point(.5, -.25,0)),
  ]))
}
