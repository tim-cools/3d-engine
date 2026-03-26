import {ElementSizeValue} from "../elementSizeValue"
import {ElementSize} from "../elementSize"
import {ApplicationContext} from "../../applicationContext"
import {ElementArea} from "../elementArea"
import {Colors} from "../../../infrastructure/colors"
import {UIElement} from "../uiElement"
import {UIRenderContext} from "../uiRenderContext"
import {Identifier, Nothing, nothing} from "../../../infrastructure/nothing"
import {MouseDown, MouseEnter, MouseLeave} from "../../events"
import {UIElementType} from "../uiElementType"

const rowHeight = 18

export class Link extends UIElement {

  private hover: boolean = false
  private titleValue: string
  private onClick: (() => void) | Nothing

  readonly width: ElementSizeValue
  readonly elementType: UIElementType = UIElementType.Link

  get title(): string {
    return this.titleValue
  }

  set title(value: string) {
    this.titleValue = value
  }

  get children(): readonly UIElement[] {
    return []
  }

  constructor(context: ApplicationContext, id: Identifier, width: ElementSizeValue, title: string, onClick: (() => void) | Nothing = nothing) {
    super(context, id)
    this.width = width;
    this.titleValue = title
    this.onClick = onClick
    context.events.subscribe(MouseEnter, this, event => this.setHover())
    context.events.subscribe(MouseLeave, this, event => this.resetHover())
    context.events.subscribe(MouseDown, this, event => this.mouseDown())
  }

  calculateSize(): ElementSize {
    return new ElementSize(this.width, new ElementSizeValue(rowHeight))
  }

  toString() {
    return this.titleValue
  }

  protected renderElement(area: ElementArea, context: UIRenderContext) {
    const size: ElementSize = this.calculateSize()
    const elementArea = area.resize(size)
    // context.fillPath(Colors.highlight, elementArea.toPath())
    context.text(Colors.ui.titleText, elementArea, this.titleValue, {underline: this.hover})
    return elementArea
  }

  private mouseDown() {
    if (this.onClick != nothing) {
      this.onClick()
    }
  }

  private resetHover() {
    return this.hover = false
  }

  private setHover() {
    return this.hover = true
  }
}
