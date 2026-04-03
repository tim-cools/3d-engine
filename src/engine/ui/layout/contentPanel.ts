import {UIElement, UIElementProperties} from "../uiElement"
import {Padding} from "../padding"
import {ElementArea} from "../elementArea"
import {RenderUIContext} from "../renderUIContext"
import {Colors} from "../../../infrastructure/colors"
import {ElementSize} from "../elementSize"
import {ElementSizeValue} from "../elementSizeValue"
import {UIElementType} from "../uiElementType"

export function contentPanel(content: UIElement | undefined = undefined) {
  return new ContentPanel({content: content})
}

export interface PanelContentProperties extends UIElementProperties {
  content?: UIElement
}

export class ContentPanel extends UIElement {

  private readonly content: UIElement | undefined = undefined

  readonly padding = Padding.single(12)
  readonly elementType: UIElementType = UIElementType.PanelContent

  get children(): readonly UIElement[] {
    return this.content != undefined ? [this.content] : []
  }

  constructor(properties: PanelContentProperties) {
    super(properties)
    this.content = properties.content
  }

  protected renderElement(area: ElementArea, context: RenderUIContext) {

    const size = this.calculateSize()
    const elementArea = area.resize(size)
    context.fillPath(elementArea.toPath(), Colors.ui.tabBackground)

    if (this.content != undefined) {
      const contentArea = elementArea.pad(this.padding)
      this.content.render(contentArea, context)
    }

    return area
  }

  calculateSize(): ElementSize {

    if (this.content == undefined) {
      return super.calculateSize()
    }

    const childSize = this.content.calculateSize()
    const height = childSize.height.proportion
      ? ElementSizeValue.full
      : this.padding.top + childSize.height.value + this.padding.bottom

    return new ElementSize(ElementSizeValue.full, height)
  }
}
