import {
  Face,
  FaceType,
  Model,
  SpaceModel,
  Triangle
} from "../models"
import {intersectsTriangleModel, SpaceModelIntersectionResult} from "./intersectsTriangleModel"
import {Logger, noLogger} from "../models/logger"
import {SubtractModels} from "./subtractModels"
import {ValuesCache} from "../../infrastructure/valuesCache"
import {sum} from "../../infrastructure"

class Counter {
  value: number = 0
  increase() {
    this.value += 1
  }
}

export class AnalyseSubtractFacesResult {

  private readonly aggregate: ValuesCache = new ValuesCache()

  process(intersection: SpaceModelIntersectionResult) {
    const triangles = sum(intersection.intersections, value => value.triangles.length)
    const key = "points: " + intersection.pointIntersections
      + ", segments: " + intersection.segmentIntersections
      + ", triangles: " + triangles
    const counter = this.aggregate.get<Counter>(key, () => new Counter())
    counter.increase()
  }

  toString() {
    const result: string[] = ["\n"]
    for (const key in this.aggregate.values) {
      const counter = this.aggregate.values[key] as Counter
      result.push(key + ": " + counter.value)
    }
    return result.join("\n")
  }
}

export function analyseSubtractFaces(models: SubtractModels): AnalyseSubtractFacesResult {
  const log = noLogger()
  const result = new AnalyseSubtractFacesResult()
  addMasterFaces(models.master, models.subtract, log, result)
  addSubtractFaces(models.subtract, models.master, log, result)
  return result
}

function addMasterFaces(master: Model, subtract: SpaceModel, logger: Logger, result: AnalyseSubtractFacesResult) {
  for (let index = 0; index < master.faces.length; index++){
    const face = master.faces[index]
    if (face.faceType != FaceType.Triangle) {
      throw new Error("Face type not yet implemented: " + FaceType[face.faceType])
    }
    addFaceInteraction(subtract, face, logger, result)
  }
}

function addFaceInteraction(subtract: SpaceModel, triangle: Triangle, logger: Logger, result: AnalyseSubtractFacesResult) {
  const intersection = intersectsTriangleModel(triangle, subtract, logger)
  result.process(intersection)
}

function addSubtractFaces(subtract: SpaceModel, master: Model, logger: Logger, result: AnalyseSubtractFacesResult) {
  for (const face of subtract.faces) {
    addSubtractFace(face, subtract, master, logger, result)
  }
}

function addSubtractFace(face: Face, subtract: SpaceModel, master: Model, logger: Logger, result: AnalyseSubtractFacesResult) {
  for (const triangle of face.triangles) {
    addSubtractTriangle(triangle, subtract, master, logger, result)
  }
}

function addSubtractTriangle(triangle: Triangle, subtract: SpaceModel, master: Model, logger: Logger, result: AnalyseSubtractFacesResult) {
  const intersection = intersectsTriangleModel(triangle, subtract, logger)
  result.process(intersection)
}
