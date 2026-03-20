import {Point, Size, SpaceModel, Subtract, Transformer,} from "../models"
import {UpdatableShape} from "../shapes"
import {Nothing, nothing} from "../nothing"
import {ModelObject} from "./modelObject"
import {Algorithm, HasAlgorithm} from "./algorithm"
import {DebugInfo, SubtractModels} from "../intersections"

export class SubtractModelObject extends ModelObject implements HasAlgorithm {

  private algorithm: Algorithm = Algorithm.SubtractFaces
  private models: SubtractModels
  private subtractPosition: Point
  private subtractSize: Size
  private debugInfo: DebugInfo | Nothing

  constructor(id: string,
              models: SubtractModels,
              subtractPosition: Point,
              subtractSize: Size,
              debugInfo: DebugInfo | Nothing = nothing,
              debugShape: ((translate: Transformer) => readonly UpdatableShape[]) | Nothing = nothing) {
    super(id, SpaceModel.empty, debugShape)
    this.models = models
    this.subtractPosition = subtractPosition
    this.subtractSize = subtractSize
    this.debugInfo = debugInfo
    this.setModel()
  }

  setAlgorithm(algorithm: Algorithm) {
    this.algorithm = algorithm
    this.setModel()
  }

  private setModel() {
    const model = this.algorithm == Algorithm.SubtractSegments
      ? Subtract.segments(this.models)
      : Subtract.faces(this.models, nothing, this.debugInfo)

    this.model = new SpaceModel(model, this.subtractPosition, this.subtractSize)
    this.shapesValue = this.createShapes()
  }
}
