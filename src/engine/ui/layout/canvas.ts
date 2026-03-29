import {ElementArea} from "../elementArea"
import {ElementSize} from "../elementSize"
import {ElementSizeValue} from "../elementSizeValue"
import {UIRenderContext} from "../uiRenderContext"
import {UIElement, UIElementProperties} from "../uiElement"
import {UIElementType} from "../uiElementType"

export class Canvas extends UIElement {

  private elementsValue: readonly UIElement[] = []

  readonly elementType: UIElementType = UIElementType.Canvas

  get elements(): readonly UIElement[] {
    return this.elementsValue
  }

  set elements(elements: readonly UIElement[]) {
    this.contextOptional?.detachElements(this.elementsValue)
    this.elementsValue = elements
    this.contextOptional?.attachElements(this.elementsValue)
  }

  get children(): readonly UIElement[] {
    return this.elementsValue
  }

  constructor(properties: UIElementProperties) {
    super(properties)
  }

  protected renderElement(area: ElementArea, context: UIRenderContext): ElementArea {
    this.renderElements(area, context)
    return area
  }

  protected renderElements(area: ElementArea, context: UIRenderContext) {
    for (const element of this.elements) {
      element.render(area, context)
    }
  }

  calculateSize(): ElementSize {
    return new ElementSize(ElementSizeValue.full, ElementSizeValue.full)
  }
}

