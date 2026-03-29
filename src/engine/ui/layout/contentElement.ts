import {UIElement, UIElementProperties} from "../uiElement"
import {ElementArea} from "../elementArea"
import {UIRenderContext} from "../uiRenderContext"
import {ElementSize} from "../elementSize"
import {EmptyElement} from "./emptyElement"
import {nothing, Nothing} from "../../../infrastructure/nothing"
import {UIElementType} from "../uiElementType"
import {UIContext} from "../uiContext"

export interface ContentProperties extends UIElementProperties {
  content?: UIElement
}

export class ContentElement extends UIElement {

  private contentValue: UIElement

  readonly elementType: UIElementType = UIElementType.ContentElement

  get content(): UIElement {
    return this.contentValue
  }

  set content(element: UIElement) {
    if (element === this.contentValue) return

    this.contextOptional?.detachElement(this.contentValue)
    this.contentValue = element
    this.contextOptional?.attachElement(element)
  }

  get children(): readonly UIElement[] {
    return [this.contentValue]
  }

  constructor(properties: ContentProperties | Nothing = nothing) {
    super(properties)
    this.contentValue = properties != nothing && properties.content != undefined ? properties.content : new EmptyElement()
  }

  protected renderElement(area: ElementArea, context: UIRenderContext): ElementArea {
    this.content.render(area, context)
    return area
  }

  calculateSize(): ElementSize {
    return this.content.calculateSize()
  }
}
