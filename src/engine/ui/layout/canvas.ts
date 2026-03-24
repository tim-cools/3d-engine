import {SceneContext} from "../../scenes/sceneContext"
import {ElementArea} from "../elementArea"
import {ElementSize} from "../elementSize"
import {ElementSizeValue} from "../elementSizeValue"
import {UIRenderContext} from "../uiRenderContext"
import {UIElement} from "../uiElement"

export class Canvas extends UIElement {

  private elementsValue: readonly UIElement[] = []

  get elements(): readonly UIElement[] {
    return this.elementsValue
  }

  constructor(context: SceneContext) {
    super(context)
  }

  render(area: ElementArea, context: UIRenderContext): ElementArea {
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

