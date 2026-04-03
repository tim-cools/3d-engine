import {UIElement, UIElementProperties} from "../uiElement"
import {ElementArea} from "../elementArea"
import {RenderUIContext} from "../renderUIContext"
import {ElementSize} from "../elementSize"
import {nothing, Nothing} from "../../../infrastructure/nothing"
import {UIElementType} from "../uiElementType"

export function contentElement(title: string, content: UIElement, properties: UIElement | undefined = undefined) {
  return new ContentElement({
    ...properties,
    content: content
  })
}

export interface ContentProperties extends UIElementProperties {
  content?: UIElement
}

export class ContentElement extends UIElement {

  private contentValue: UIElement | Nothing

  readonly elementType: UIElementType = UIElementType.ContentElement

  get content(): UIElement | Nothing {
    return this.contentValue
  }

  set content(element: UIElement | Nothing) {
    if (element === this.contentValue) return

    if (this.contentValue != nothing) {
      this.contextOptional?.detachElement(this.contentValue)
    }

    this.contentValue = element

    if (element != nothing) {
      this.contextOptional?.attachElement(element)
    }
  }

  get children(): readonly UIElement[] {
    return this.contentValue != nothing ? [this.contentValue] : []
  }

  constructor(properties: ContentProperties | Nothing = nothing) {
    super(properties)
    this.contentValue = properties != nothing && properties.content != undefined ? properties.content : nothing
  }

  protected renderElement(area: ElementArea, context: RenderUIContext): ElementArea {
    if (this.content != nothing) {
      this.content.render(area, context)
    }
    return area
  }

  calculateSize(): ElementSize {
    if (this.content != nothing) {
      return this.content.calculateSize()
    }
    return super.calculateSize()
  }
}
