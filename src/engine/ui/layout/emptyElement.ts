import {UIElement} from "../uiElement"
import {UIElementType} from "../uiElementType"

export class EmptyElement extends UIElement {

  readonly elementType: UIElementType = UIElementType.EmptyElement

  get children(): readonly UIElement[] {
    return []
  }

  constructor() {
    super({ id: "empty"})
  }
}
