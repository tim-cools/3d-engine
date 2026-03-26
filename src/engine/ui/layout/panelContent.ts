import {UIElement} from "../uiElement"
import {Padding} from "../padding"
import {ApplicationContext} from "../../applicationContext"
import {ElementArea} from "../elementArea"
import {UIRenderContext} from "../uiRenderContext"
import {Colors} from "../../../infrastructure/colors"
import {ElementSize} from "../elementSize"
import {ElementSizeValue} from "../elementSizeValue"
import {UIElementType} from "../uiElementType"

export class PanelContent extends UIElement {

  readonly padding = Padding.single(12)
  readonly elementType: UIElementType = UIElementType.PanelContent

  get children(): readonly UIElement[] {
    return [this.content]
  }

  constructor(context: ApplicationContext, private content: UIElement) {
    super(context, "content")
  }

  protected renderElement(area: ElementArea, context: UIRenderContext) {

    const size = this.calculateSize()
    const elementArea = area.resize(size)
    context.fillPath(Colors.ui.tabBackground, elementArea.toPath())

    const contentArea = elementArea.pad(this.padding)
    this.content.render(contentArea, context)
    return area
  }

  calculateSize(): ElementSize {

    const childSize = this.content.calculateSize()
    const height = this.padding.top + childSize.height.value + this.padding.bottom

    return new ElementSize(ElementSizeValue.full, new ElementSizeValue(height))
  }
}
