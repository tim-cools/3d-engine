import {fullSize} from "../elementSizeValue"
import {UIElementType} from "../uiElementType"
import {ObjectState, ObjectStateType} from "../../state/objectState"
import {Stack, CollapsablePanel, ContentElement, row, stack, collapsablePanel} from "../layout"
import {Object} from "../../objects"
import {nothing, Nothing} from "../../../infrastructure/nothing"
import {ObjectProperty} from "../../objects"
import {iconButton, text} from "../controls"
import {Icon} from "../rendering/icons"
import {UIElement} from "../uiElement"
import {UIContext} from "../uiContext"

export function objectDetails() {
  return new ObjectDetails()
}

export class ObjectDetails extends ContentElement {

  private readonly noObjectsCaption = "No object selected"
  private readonly objectCaption = "Object: "
  private readonly noPropertiesCaption = "No properties"

  private readonly properties: Stack
  private readonly panel: CollapsablePanel

  private lastObject: Object | Nothing = nothing

  readonly elementType: UIElementType = UIElementType.SceneInfo

  constructor() {
    super()

    this.properties = stack()
    this.panel = collapsablePanel(this.noObjectsCaption, this.properties, {id: "objectDetails"})
    this.content = this.panel
  }

  protected contextAttached(context: UIContext) {
    context.state.subscribeUpdate(ObjectStateType, state => this.setObject(state), this)
    this.setObject(context.state.get(ObjectStateType))
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
      this.properties.children = [text(this.noPropertiesCaption, { id: "noProperties", width: fullSize})]
      return
    }

    this.setPropertiesValues(object.properties.values)
    object.properties.subscribeUpdate(this, properties => this.setPropertiesValues(properties))
  }

  private setPropertiesValues(properties: readonly ObjectProperty[]) {
    this.properties.children = properties.map((property) => ObjectDetails.createPropertyRow(property))
  }

  private static createPropertyRow(property: ObjectProperty) {
    const elements: UIElement[] = [
      text(property.name, {width: 160}),
      text(property.value, {width: fullSize})
    ]
    if (property.update != nothing) {
      elements.push(iconButton(Icon.Loop, {id: "change", size: 18, onClick: property.update}))
    }
    return row({id: "ObjectProperty", padding: 0}, elements)
  }
}
