import {UIElement} from "../uiElement"
import {ApplicationContext} from "../../applicationContext"
import {ElementArea} from "../elementArea"
import {UIRenderContext} from "../uiRenderContext"
import {ElementSize} from "../elementSize"
import {EmptyElement} from "./emptyElement"
import {Identifier, nothing, Nothing} from "../../../infrastructure/nothing"
import {UIElementType} from "../uiElementType"

export class ContentElement extends UIElement {

  private contentValue: UIElement

  readonly elementType: UIElementType = UIElementType.ContentElement

  get content(): UIElement {
    return this.contentValue
  }

  set content(element: UIElement) {
    this.context.unsubscribeElement(this.contentValue)
    this.contentValue = element
  }

  get children(): readonly UIElement[] {
    return [this.contentValue]
  }

  constructor(context: ApplicationContext, id: Identifier, content: UIElement | Nothing = nothing) {
    super(context, id)
    this.contentValue = content ?? new EmptyElement(context)
  }

  protected renderElement(area: ElementArea, context: UIRenderContext): ElementArea {
    this.content.render(area, context)
    return area
  }

  calculateSize(): ElementSize {
    return this.content.calculateSize()
  }
}
