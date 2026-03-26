import {UIElement} from "../uiElement"
import {ApplicationContext} from "../../applicationContext"
import {UIElementType} from "../uiElementType"
import {Identifier} from "../../../infrastructure/nothing"

export class EmptyElement extends UIElement {

  readonly elementType: UIElementType = UIElementType.EmptyElement

  get children(): readonly UIElement[] {
    return []
  }

  constructor(context: ApplicationContext, id: Identifier = "empty") {
    super(context, id)
  }
}
