import {Point, Size, SpaceModel, Subtract, Transformer,} from "../models"
import {Shape} from "../shapes"
import {Nothing, nothing} from "../nothing"
import {ModelObject} from "./modelObject"
import {DebugInfo, SubtractModels} from "../intersections"
import {SceneContext} from "../scenes/sceneContext"
import {Algorithm} from "../state/algorithm"
import {AlgorithmState} from "../state/algorithmState"
import {State} from "../state/state"

export class SubtractModelObject extends ModelObject {

  private readonly models: SubtractModels
  private readonly subtractPosition: Point
  private readonly subtractSize: Size
  private readonly debugInfo: DebugInfo | Nothing
  private readonly algorithmState: State<AlgorithmState>

  constructor(context: SceneContext,
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
    this.algorithmState = context.algorithm
    context.algorithm.onUpdate(() => this.setModel())
    this.setModel()
  }

  private setModel() {
    const model = this.algorithmState.value.value == Algorithm.SubtractSegments
      ? Subtract.segments(this.models)
      : Subtract.faces(this.models, nothing, this.debugInfo)

    this.model = new SpaceModel(model, this.subtractPosition, this.subtractSize)
    this.updateShapes()
  }
}
