import {Point, Size, SpaceModel, Subtract, Transformer,} from "../models"
import {Shape} from "../shapes"
import {Nothing, nothing} from "../../infrastructure/nothing"
import {ModelObject} from "./modelObject"
import {DebugInfo, SubtractModels} from "../intersections"
import {ApplicationContext} from "../applicationContext"
import {Algorithm, AlgorithmStateIdentifier, AlgorithmState} from "../state"

export class SubtractModelObject extends ModelObject {

  private readonly models: SubtractModels
  private readonly subtractPosition: Point
  private readonly subtractSize: Size
  private readonly debugInfo: DebugInfo | Nothing
  private readonly algorithmState: AlgorithmState

  constructor(context: ApplicationContext,
              id: string,
              models: SubtractModels,
              subtractPosition: Point,
              subtractSize: Size,
              debugInfo: DebugInfo | Nothing = nothing,
              debugShape: ((translate: Transformer) => readonly Shape[]) | Nothing = nothing) {
    super(context, id, SpaceModel.empty, debugShape)
    this.models = models
    this.subtractPosition = subtractPosition
    this.subtractSize = subtractSize
    this.debugInfo = debugInfo
    this.algorithmState = context.state.get(AlgorithmStateIdentifier)
    context.state.subscribeUpdate(AlgorithmStateIdentifier, () => this.setModel())
    this.setModel()
  }

  private setModel() {
    const model = this.algorithmState.value == Algorithm.SubtractSegments
      ? Subtract.segments(this.models)
      : Subtract.faces(this.models, nothing, this.debugInfo)

    this.model = new SpaceModel(model, this.subtractPosition, this.subtractSize)
    this.updateShapes()
  }
}
