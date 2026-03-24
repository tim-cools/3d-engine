import {UIElement} from "../uiElement"
import {SceneContext} from "../../scenes/sceneContext"
import {ElementArea} from "../elementArea"
import {UIRenderContext} from "../uiRenderContext"
import {ElementSize} from "../elementSize"
import {EmptyElement} from "./emptyElement"
import {nothing, Nothing} from "../../nothing"

export class ContentElement extends UIElement {

  private contentValue: UIElement

  get content(): UIElement {
    return this.contentValue
  }

  constructor(context: SceneContext, content: UIElement | Nothing = nothing) {
    super(context)
    this.contentValue = content ?? new EmptyElement(context)
  }

  protected renderElement(area: ElementArea, context: UIRenderContext): ElementArea {
    this.content.render(area, context)
    return area
  }

  protected setContent(value: UIElement) {
    this.contentValue = value
  }

  calculateSize(): ElementSize {
    return this.content.calculateSize()
  }
}
