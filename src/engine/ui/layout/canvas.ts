import {ApplicationContext} from "../../applicationContext"
import {ElementArea} from "../elementArea"
import {ElementSize} from "../elementSize"
import {ElementSizeValue} from "../elementSizeValue"
import {UIRenderContext} from "../uiRenderContext"
import {UIElement} from "../uiElement"
import {UIElementType} from "../uiElementType"
import {Identifier} from "../../../infrastructure/nothing"

export class Canvas extends UIElement {

  private elementsValue: readonly UIElement[] = []

  readonly elementType: UIElementType = UIElementType.Canvas

  get elements(): readonly UIElement[] {
    return this.elementsValue
  }

  get children(): readonly UIElement[] {
    return this.elementsValue
  }

  constructor(context: ApplicationContext, id: Identifier) {
    super(context, id)
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

  protected setElements(values: readonly UIElement[]) {
    this.elementsValue = values
  }

  calculateSize(): ElementSize {
    return new ElementSize(ElementSizeValue.full, ElementSizeValue.full)
  }
}

