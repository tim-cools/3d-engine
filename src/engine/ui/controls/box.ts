import {UIElement, UIElementProperties} from "../uiElement"
import {ElementArea} from "../elementArea"
import {UIRenderContext} from "../uiRenderContext"
import {ElementSize} from "../elementSize"
import {UIElementType} from "../uiElementType"
import {ContentElement} from "../layout/contentElement"
import {Padding} from "../padding"
import {Colors} from "../../../infrastructure/colors"

export interface BoxProperties extends UIElementProperties {
  backgroundColor?: string
  size?: ElementSize
  content?: UIElement
  padding?: Padding
}

export class Box extends ContentElement {

  private readonly backgroundColor: string = Colors.ui.tabBackground
  private readonly padding: Padding = Padding.single(8)
  private readonly size: ElementSize = ElementSize.full

  readonly elementType: UIElementType = UIElementType.Stack

  constructor(properties: BoxProperties) {
    super(properties)
    if (properties.backgroundColor != undefined) {
      this.backgroundColor = properties.backgroundColor
    }
    if (properties.padding != undefined) {
      this.padding = properties.padding
    }
    if (properties.size != undefined) {
      this.size = properties.size
    }
    if (properties.content != undefined) {
      this.content = properties.content
    }
  }

  protected renderElement(area: ElementArea, context: UIRenderContext) {
    context.fillPath(this.backgroundColor, area.toPath())
    const contentArea = area.pad(this.padding)
    super.renderElement(contentArea, context)
    return contentArea
  }

  calculateSize(): ElementSize {
    return this.size
  }
}
