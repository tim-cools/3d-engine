import {Point, Size, SpaceModel, Subtract, Transformer,} from "../models"
import {Shape} from "../shapes"
import {Nothing, nothing} from "../../infrastructure/nothing"
import {ModelObject} from "./modelObject"
import {DebugInfo, SubtractModels} from "../intersections"
import {ApplicationContext} from "../applicationContext"
import {Algorithm} from "../state"
import {ObjectProperty, TypedObjectProperty} from "./objectProperties"

export class SubtractModelObject extends ModelObject {

  private readonly renderMasterModelProperty: TypedObjectProperty<boolean>
  private readonly renderSubtractModelProperty: TypedObjectProperty<boolean>
  private readonly algorithmProperty: TypedObjectProperty<Algorithm>

  private readonly models: SubtractModels
  private readonly subtractPosition: Point
  private readonly subtractSize: Size
  private readonly debugInfo: DebugInfo | Nothing

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

    this.renderMasterModelProperty = this.properties.add<boolean>("Render Master Model", false, nothing, value => !value)
    this.renderSubtractModelProperty = this.properties.add<boolean>("Render Subtract Model", false, nothing, value => !value)
    this.algorithmProperty = this.properties.add<Algorithm>("Algorithm", Algorithm.SubtractSegments, value => Algorithm[value], value => SubtractModelObject.switchAlgorithm(value))

    this.setModel()
  }

  protected propertiesChanged(properties: readonly ObjectProperty[]) {
    this.setModel()
    this.updateShapes()
  }

  private setModel() {

    if (this.renderMasterModelProperty.typed) {
      this.model = new SpaceModel(this.models.master, this.subtractPosition, this.subtractSize)
      //todo show both models when both are true
      return
    }

    if (this.renderSubtractModelProperty.typed) {
      //todo: this is not correct
      // const position = this.subtractPosition.add(this.models.subtract.position)
      const position = this.models.subtract.position.multiplySize(this.models.subtract.scale)
      //const size = this.subtractSize.multiply(this.models.subtract.scale)
      this.model = new SpaceModel(this.models.subtract.model, position, this.subtractSize)
      return
    }

    const model = this.algorithmProperty.typed == Algorithm.SubtractSegments
      ? Subtract.segments(this.models)
      : Subtract.faces(this.models, nothing, this.debugInfo)

    this.model = new SpaceModel(model, this.subtractPosition, this.subtractSize)
  }

  private static switchAlgorithm(value: Algorithm) {
    const newValue = (value + 1) % (Algorithm.SubtractFaces + 1)
    console.log(`switchSAlgorithm: ${Algorithm[newValue]}`)
    return newValue
  }
}
