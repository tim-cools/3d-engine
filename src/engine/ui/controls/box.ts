import {setPaddingProperty, setProperty, UIElement, UIElementProperties} from "../uiElement"
import {ElementArea} from "../elementArea"
import {RenderUIContext} from "../renderUIContext"
import {ElementSize} from "../elementSize"
import {UIElementType} from "../uiElementType"
import {ContentElement} from "../layout"
import {Padding} from "../padding"
import {Colors} from "../../../infrastructure/colors"
import {nothing, Nothing} from "../../../infrastructure/nothing"

export function box(boxProperties: BoxProperties | Nothing = nothing, content: UIElement | undefined = undefined) {
  return new Box({
    content: content,
    ...boxProperties
  })
}

export interface BoxProperties extends UIElementProperties {
  backgroundColor?: string
  size?: ElementSize
  content?: UIElement
  padding?: Padding | number
}

export class Box extends ContentElement {

  private readonly backgroundColor: string = Colors.ui.tabBackground
  private readonly padding: Padding = Padding.single(8)

  size: ElementSize = ElementSize.full
  readonly elementType: UIElementType = UIElementType.Box

  constructor(properties: BoxProperties | Nothing = nothing) {
    super(properties)
    if (properties == nothing) return
    this.backgroundColor = setProperty(properties.backgroundColor, this.backgroundColor)
    this.padding = setPaddingProperty(properties.padding, this.padding)
    this.size = setProperty(properties.size, this.size)
    this.content = setProperty(properties.content, this.content)
  }

  protected renderElement(area: ElementArea, context: RenderUIContext) {

    context.fillPath(area.toPath(), this.backgroundColor)
    const contentArea = area.pad(this.padding)
    super.renderElement(contentArea, context)
    return area
  }

  calculateSize(): ElementSize {
    return this.content && this.size.height.proportion && this.size.width.proportion
      ? this.content.calculateSize().pad(this.padding)
      : this.size
  }
}
