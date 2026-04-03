import {setProperty, UIElement, UIElementProperties} from "../uiElement"
import {UIElementType} from "../uiElementType"
import {ElementSizeValue} from "../elementSizeValue"
import {nothing, Nothing} from "../../../infrastructure/nothing"

export function emptyElement(properties: EmptyElementProperties | undefined = undefined) {
  return new EmptyElement({
    ...properties
  })
}

export interface EmptyElementProperties extends UIElementProperties {
  width?: ElementSizeValue
}

export class EmptyElement extends UIElement {

  private width: ElementSizeValue
  readonly elementType: UIElementType = UIElementType.EmptyElement

  get children(): readonly UIElement[] {
    return []
  }

  constructor(properties: EmptyElementProperties | Nothing = nothing) {
    super(properties)
    this.width = setProperty(properties?.width, ElementSizeValue.full)
  }
}
