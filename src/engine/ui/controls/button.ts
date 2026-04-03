import {ElementSizeValue} from "../elementSizeValue"
import {ElementSize} from "../elementSize"
import {ElementArea} from "../elementArea"
import {Colors} from "../../../infrastructure/colors"
import {setProperty, setSizeProperty, UIElement, UIElementProperties} from "../uiElement"
import {AlignHorizontal, AlignVertical, RenderUIContext} from "../renderUIContext"
import {UIElementType} from "../uiElementType"
import {UIContext} from "../uiContext"
import {MouseDown, MouseEnter, MouseLeave} from "../../events"
import {nothing, Nothing} from "../../../infrastructure/nothing"

const defaultHeight = 32

export function button(title: string, onClick: (() => void), properties: ButtonProperties) {
  return new Button({
    ...properties,
    title: title,
    onClick: onClick
  })
}

export enum ButtonState {
  Normal,
  Hover,
}

export interface ButtonProperties extends UIElementProperties {
  content?: UIElement
  width?: ElementSizeValue | number
  title?: string
  onClick?: (() => void) | Nothing
}

const textStyle = {alignHorizontal: AlignHorizontal.Centre, alignVertical: AlignVertical.Middle}

export class Button extends UIElement {

  private titleValue: string = ""
  private onClick: (() => void) | Nothing = nothing
  private hover: boolean = false

  readonly width: ElementSizeValue = ElementSizeValue.full
  readonly elementType: UIElementType = UIElementType.Button

  get title(): string {
    return this.titleValue
  }

  set title(value: string) {
    this.titleValue = value
  }

  get children(): readonly UIElement[] {
    return []
  }

  constructor(properties: ButtonProperties) {
    super(properties)
    this.width = setSizeProperty(properties.width, this.width)
    this.titleValue = setProperty(properties.title, this.titleValue)
    this.onClick = setProperty(properties.onClick, this.onClick)
  }

  protected contextAttached(context: UIContext) {
    context.events.subscribe(MouseEnter, event => this.setHover(), this)
    context.events.subscribe(MouseLeave, event => this.resetHover(), this)
    context.events.subscribe(MouseDown, event => this.mouseDown(), this)
  }

  protected renderElement(area: ElementArea, context: RenderUIContext) {

    const size: ElementSize = this.calculateSize()
    const elementArea = area.resize(size)

    context.fillPath(elementArea.toPath(), this.hover ? Colors.ui.buttonHover : Colors.ui.buttonBackground)

    const middle = elementArea.middle()
    context.text(this.titleValue, Colors.ui.buttonText, middle, textStyle)

    return elementArea
  }

  calculateSize(): ElementSize {
    return new ElementSize(this.width, new ElementSizeValue(defaultHeight))
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
