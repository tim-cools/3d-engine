import {SceneContext} from "../scenes/sceneContext"
import {ElementArea} from "./elementArea"
import {ElementSize} from "./elementSize"
import {ElementSizeValue} from "./elementSizeValue"
import {UIRenderContext} from "./uiRenderContext"

export abstract class UIElement {

  readonly context: SceneContext

  protected constructor(context: SceneContext) {
    this.context = context
  }

  render(area: ElementArea, context: UIRenderContext): ElementArea {
    return area
  }

  calculateSize(): ElementSize {
    return new ElementSize(ElementSizeValue.full, ElementSizeValue.full)
  }
}
