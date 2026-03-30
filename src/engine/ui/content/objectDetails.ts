import {ElementSizeValue} from "../elementSizeValue"
import {UIElementType} from "../uiElementType"
import {ObjectState, ObjectStateType} from "../../state/objectState"
import {Row, Stack, Panel, ContentElement} from "../layout"
import {Object} from "../../objects"
import {nothing, Nothing} from "../../../infrastructure/nothing"
import {ObjectProperty} from "../../objects/objectProperties"
import {Text, IconButton} from "../controls"
import {Icon} from "../rendering/icons"
import {UIElement} from "../uiElement"
import {UIContext} from "../uiContext"

export class ObjectDetails extends ContentElement {

  private readonly noObjectsCaption = "No object selected"
  private readonly objectCaption = "Object: "
  private readonly noPropertiesCaption = "No properties"

  private readonly properties: Stack
  private readonly panel: Panel

  private lastObject: Object | Nothing = nothing

  readonly elementType: UIElementType = UIElementType.SceneInfo

  constructor() {
    super()

    this.properties = new Stack()
    this.panel = new Panel({id: "objectDetails", title: this.noObjectsCaption, content: this.properties})
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
      this.properties.children = [new Text({ id: "noProperties", width: ElementSizeValue.full, text: this.noPropertiesCaption})]
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
      new Text({width: new ElementSizeValue(160), text: property.name}),
      new Text({width: new ElementSizeValue(1, true), text: property.value})
    ]
    if (property.update != nothing) {
      elements.push(new IconButton({id: "change", size: new ElementSizeValue(18), icon: Icon.Loop, onClick: property.update}))
    }
    return new Row({children: elements})
  }
}
