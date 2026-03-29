import {ElementSizeValue} from "../elementSizeValue"
import {ElementSize} from "../elementSize"
import {ElementArea} from "../elementArea"
import {Colors} from "../../../infrastructure/colors"
import {setProperty, UIElement, UIElementProperties} from "../uiElement"
import {UIRenderContext} from "../uiRenderContext"
import {Id, Nothing, nothing} from "../../../infrastructure/nothing"
import {MouseDown, MouseEnter, MouseLeave} from "../../events"
import {UIElementType} from "../uiElementType"
import {UIContext} from "../uiContext"

const rowHeight = 18

export interface LinkProperties extends UIElementProperties {
  id?: Id
  width?: ElementSizeValue
  title?: string
  onClick?: (() => void) | Nothing
}

export class Link extends UIElement {

  private hover: boolean = false
  private titleValue: string = ""
  private onClick: (() => void) | Nothing = nothing

  readonly width: ElementSizeValue = ElementSizeValue.full
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

  constructor(properties: LinkProperties) {
    super(properties)

    this.width = setProperty(properties.width, this.width)
    this.titleValue = setProperty(properties.title, this.titleValue)
    this.onClick = setProperty(properties.onClick, this.onClick)
  }

  protected contextAttached(context: UIContext) {
    context.events.subscribe(MouseEnter, event => this.setHover(), this)
    context.events.subscribe(MouseLeave, event => this.resetHover(), this)
    context.events.subscribe(MouseDown, event => this.mouseDown(), this)
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
