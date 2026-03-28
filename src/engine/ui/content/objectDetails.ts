import {ElementSizeValue} from "../elementSizeValue"
import {Row, Stack, Text} from "../controls"
import {ContentElement} from "../layout/contentElement"
import {ApplicationContext} from "../../applicationContext"
import {UIElementType} from "../uiElementType"
import {ObjectState, ObjectStateType} from "../../state/objectState"
import {Panel} from "../layout/panel"
import {Object} from "../../objects"
import {nothing, Nothing} from "../../../infrastructure/nothing"
import {ObjectProperty} from "../../objects/objectProperties"
import {IconButton} from "../controls/iconButton"
import {Icon} from "../rendering/icons"
import {UIElement} from "../uiElement"

export class ObjectDetails extends ContentElement {

  private readonly noObjectsCaption = "No object selected"
  private readonly objectCaption = "Object: "
  private readonly noPropertiesCaption = "No properties"

  private readonly object: ObjectState
  private readonly properties: Stack
  private readonly panel: Panel

  private lastObject: Object | Nothing = nothing

  readonly elementType: UIElementType = UIElementType.SceneInfo

  constructor(context: ApplicationContext) {
    super(context, "sceneInfo")

    this.object = context.state.get(ObjectStateType)

    this.properties = new Stack(context, "stack", [])
    this.panel = new Panel(context, "objectDetails", this.noObjectsCaption, this.properties)
    this.content = this.panel
    this.setObject(this.object)

    context.state.subscribeUpdate(ObjectStateType, state => this.setObject(state), this)
  }

  private setObject(state: ObjectState) {
    this.panel.title = state.current ? this.objectCaption + state.current.id : this.noObjectsCaption
    this.setProperties(state.current)
  }

  private setProperties(object: Object | Nothing) {
    if (this.lastObject != nothing) {
      this.lastObject.properties.unsubscribeUpdate(this)
    }

    this.lastObject = object
    if (object == nothing || object.properties.values.length == 0) {
      this.properties.children = [new Text(this.context, "noProperties", ElementSizeValue.full, this.noPropertiesCaption)]
      return
    }

    this.setPropertiesValues(object.properties.values)
    object.properties.subscribeUpdate(this, properties => this.setPropertiesValues(properties))
  }

  private setPropertiesValues(properties: readonly ObjectProperty[]) {
    const elements = properties.map((property, index: number) => this.createPropertyRow(property, index))
    this.properties.children = elements
  }

  private createPropertyRow(property: ObjectProperty, index: number) {
    const elements: UIElement[] = [
      new Text(this.context, "title", new ElementSizeValue(160), property.name),
      new Text(this.context, "title", new ElementSizeValue(1, true), property.value),
    ]
    if (property.update != nothing) {
      elements.push(new IconButton(this.context, "change", new ElementSizeValue(18), Icon.Loop, property.update))
    }
    return new Row(this.context, "row." + index, elements)
  }
}
