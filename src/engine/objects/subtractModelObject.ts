import {Point, Size, SpaceModel, Subtract, SubtractModels, Transformer,} from "../models"
import {UpdatableShape} from "../shapes"
import {Nothing, nothing} from "../nothing"
import {ModelObject} from "./modelObject"
import {Algorithm, HasAlgorithm} from "./algorithm"

export class SubtractModelObject extends ModelObject implements HasAlgorithm {

  private algorithm: Algorithm = Algorithm.SubtractSegments
  private models: SubtractModels
  private subtractPosition: Point
  private subtractSize: Size

  constructor(id: string,
              models: SubtractModels,
              subtractPosition: Point, subtractSize: Size,
              debugShape: ((translate: Transformer) => readonly UpdatableShape[]) | Nothing = nothing) {
    super(id, SpaceModel.empty, debugShape)
    this.models = models
    this.subtractPosition = subtractPosition
    this.subtractSize = subtractSize
    this.setModel()
  }

  setAlgorithm(algorithm: Algorithm) {
    this.algorithm = algorithm
    this.setModel()
  }

  private setModel() {
    const model = this.algorithm == Algorithm.SubtractSegments
      ? Subtract.segments(this.models)
      : Subtract.faces(this.models)

    this.model = new SpaceModel(model, this.subtractPosition, this.subtractSize)
    this.shapesValue = this.createShapes()
  }
}
