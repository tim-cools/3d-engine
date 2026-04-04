import {Point, Size, SpaceModel} from "../models"
import {ModelObject} from "./modelObject"
import {ObjectProperty, TypedObjectProperty} from "./objectProperties"
import {ApplicationContext} from "../applicationContext"
import {SphereModel} from "../models/sphereModel"

export class SphereObject extends ModelObject {

  private readonly segmentValues = [2, 3, 7, 13, 17]

  private segmentsProperty: TypedObjectProperty<number>

  constructor(context: ApplicationContext, id: string) {
    super(context, id, SpaceModel.empty)

    this.segmentsProperty = this.properties.add<number>("Segments", 1,
        value => this.segmentValues[value].toString(),
        value => this.switchSegments(value))

    this.createModel()
  }

  protected propertiesChanged(properties: readonly ObjectProperty[]) {
    super.propertiesChanged(properties)
    this.createModel()
  }

  private createModel() {
    const segments = this.segmentValues[this.segmentsProperty.typed]
    const model = SphereModel.create(segments)
    this.model = new SpaceModel(model, Point.null, Size.default)
  }

  private switchSegments(value: number) {
    return (value + 1) % this.segmentValues.length
  }
}
