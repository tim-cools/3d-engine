import {SceneContext} from "../scenes/sceneContext"
import {ElementArea} from "./elementArea"
import {ElementSize} from "./elementSize"
import {ElementSizeValue} from "./elementSizeValue"
import {UIRenderContext} from "./uiRenderContext"

export abstract class UIElement {

  private lastAreaValue: ElementArea = ElementArea.single(0)

  readonly context: SceneContext

  get lastArea(): ElementArea {
    return this.lastAreaValue
  }

  protected constructor(context: SceneContext) {
    this.context = context
  }

  render(area: ElementArea, context: UIRenderContext): ElementArea {
    this.lastAreaValue = this.renderElement(area, context)
    return area
  }

  protected renderElement(area: ElementArea, context: UIRenderContext): ElementArea {
    return area
  }

  calculateSize(): ElementSize {
    return new ElementSize(ElementSizeValue.full, ElementSizeValue.full)
  }
}
