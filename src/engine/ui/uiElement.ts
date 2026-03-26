import {ApplicationContext} from "../applicationContext"
import {ElementArea} from "./elementArea"
import {ElementSize} from "./elementSize"
import {ElementSizeValue} from "./elementSizeValue"
import {UIRenderContext} from "./uiRenderContext"
import {UIElementType} from "./uiElementType"
import {Identifier} from "../../infrastructure/nothing"

export abstract class UIElement {

  private lastAreaValue: ElementArea = ElementArea.single(0)

  readonly id: string
  readonly context: ApplicationContext

  get lastArea(): ElementArea {
    return this.lastAreaValue
  }

  visible: boolean = true

  abstract get children(): readonly UIElement[]
  abstract get elementType(): UIElementType

  protected constructor(context: ApplicationContext, id: Identifier) {
    this.context = context
    this.id = id
  }

  render(area: ElementArea, context: UIRenderContext): ElementArea {
    this.lastAreaValue = this.renderElement(area, context)
    return area
  }

  calculateSize(): ElementSize {
    return this.visible ? new ElementSize(ElementSizeValue.full, ElementSizeValue.full) : ElementSize.zero
  }

  protected renderElement(area: ElementArea, context: UIRenderContext): ElementArea {
    return area
  }
}
