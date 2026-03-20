import {Scene} from "./scenes"
import {subtractSphereTestModelAkaDeathStar} from "../../tests/operations/subtractSphereTestModelAkaDeathStar"
import {ModelObject, Object} from "../objects"
import {Lazy} from "../../infrastructure/lazy"
import {SubtractModelObject} from "../objects/subtractModelObject"
import {ModelType, Point, Size, SpaceModel, Triangle} from "../models"
import {TriangleModel} from "../models/triangleModel"
import {DebugInfo} from "../intersections"

export function subtractSphere(): Scene {

  function subtractSphere() {
    const models = subtractSphereTestModelAkaDeathStar(10, 7)
    const highlightTrianglesForDebugging: number[] = [] // -321074190]
    return new SubtractModelObject("subtract", models, Point.null, Size.default, new DebugInfo(highlightTrianglesForDebugging) )
  }

  function debugTriangles() {
    const triangle = new Triangle(
      new Point(-0.14389854358757728, 0.1641275495353166, -0.4048059917432631),
      new Point(-0.10040507566876833, 0.26436976651092137, -0.425751341976881),
      new Point(-0.19813401097727204, 0.1641275495353166, -0.4728151167445393),
      ModelType.Highlight
    )
    const model = TriangleModel.createFromTriangle(triangle, )
    return new ModelObject("debug.model", new SpaceModel(model, Point.null, Size.default))
  }

  return new Scene("death star", new Lazy<Object[]>(() => [
    subtractSphere(),
    //debugTriangles()
  ]))
}
