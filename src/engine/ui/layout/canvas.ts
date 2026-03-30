import {ElementArea} from "../elementArea"
import {ElementSize} from "../elementSize"
import {ElementSizeValue} from "../elementSizeValue"
import {UIRenderContext} from "../uiRenderContext"
import {setProperty, UIElement, UIElementProperties} from "../uiElement"
import {UIElementType} from "../uiElementType"
import {nothing, Nothing} from "../../../infrastructure/nothing"

export interface CanvasProperties extends UIElementProperties {
  elements?: readonly UIElement[]
}

export class Canvas extends UIElement {

  static left(number: number) {
    return new Left(number)
  }

  static right(number: number) {
    return new Left(number)
  }

  static top(number: number) {
    return new Left(number)
  }

  static bottom(number: number) {
    return new Left(number)
  }

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

  constructor(properties: CanvasProperties | Nothing = nothing) {
    super(properties)
    if (properties === nothing) return
    this.elementsValue = setProperty(properties.elements, this.elementsValue)
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

