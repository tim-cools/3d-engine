import {ApplicationContext} from "../../applicationContext"
import {UIElement} from "../uiElement"
import {ElementArea} from "../elementArea"
import {UIRenderContext} from "../uiRenderContext"
import {ElementSize} from "../elementSize"
import {UIElementType} from "../uiElementType"
import {Identifier} from "../../../infrastructure/nothing"
import {ContentElement} from "../layout/contentElement"
import {Padding} from "../padding"

export class Box extends ContentElement {

  private readonly backgroundColor: string

  readonly elementType: UIElementType = UIElementType.Stack

  constructor(context: ApplicationContext, id: Identifier, backgroundColor: string, private size: ElementSize, content: UIElement, private padding: Padding = Padding.single(8)) {
    super(context, id)
    this.backgroundColor = backgroundColor
    this.content = content
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
