import {UIElement, UIElementProperties} from "../uiElement"
import {Padding} from "../padding"
import {ElementArea} from "../elementArea"
import {UIRenderContext} from "../uiRenderContext"
import {Colors} from "../../../infrastructure/colors"
import {ElementSize} from "../elementSize"
import {ElementSizeValue} from "../elementSizeValue"
import {UIElementType} from "../uiElementType"

export interface PanelContentProperties extends UIElementProperties {
  content: UIElement
}

export class PanelContent extends UIElement {

  private readonly content: UIElement

  readonly padding = Padding.single(12)
  readonly elementType: UIElementType = UIElementType.PanelContent

  get children(): readonly UIElement[] {
    return [this.content]
  }

  constructor(properties: PanelContentProperties) {
    super(properties)
    this.content = properties.content
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
