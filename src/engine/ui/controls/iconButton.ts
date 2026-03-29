import {ElementSizeValue} from "../elementSizeValue"
import {ElementSize} from "../elementSize"
import {ElementArea} from "../elementArea"
import {Colors} from "../../../infrastructure/colors"
import {setProperty, UIElement, UIElementProperties} from "../uiElement"
import {UIRenderContext} from "../uiRenderContext"
import {UIElementType} from "../uiElementType"
import {nothing, Nothing} from "../../../infrastructure/nothing"
import {Icon} from "../rendering/icons"
import {ButtonState} from "./button"
import {MouseDown, MouseEnter, MouseLeave} from "../../events"
import {UIContext} from "../uiContext"

export interface IconButtonProperties extends UIElementProperties {
  size?: ElementSizeValue
  icon?: Icon
  onClick?: (() => void)
}

export class IconButton extends UIElement {

  private readonly onClick: (() => void) | Nothing = nothing

  private state: ButtonState = ButtonState.Normal

  readonly size: ElementSizeValue = new ElementSizeValue(25)
  readonly elementType: UIElementType = UIElementType.Button

  icon: Icon = Icon.Close

  get children(): readonly UIElement[] {
    return []
  }

  constructor(properties: IconButtonProperties) {
    super(properties)
    this.size = setProperty(properties.size, this.size)
    this.icon = setProperty(properties.icon, this.icon)
    this.onClick = setProperty(properties.onClick, this.onClick)
  }

  protected contextAttached(context: UIContext) {
    context.events.subscribe(MouseEnter, event => this.mouseEnter(), this)
    context.events.subscribe(MouseLeave, event => this.mouseLeave(), this)
    context.events.subscribe(MouseDown, event => this.mouseDown(), this)
  }

  protected renderElement(area: ElementArea, context: UIRenderContext) {

    const size: ElementSize = this.calculateSize()
    const elementArea = area.resize(size)

    if (this.state == ButtonState.Hover) {
      context.fillRectangle(Colors.ui.buttonBackground, elementArea.left, elementArea.top, elementArea.width, elementArea.height)
      context.icon(Colors.ui.buttonText, this.icon, area.left, area.top, area.width - 7)
    } else {
      context.icon(Colors.ui.text, this.icon, area.left, area.top, area.width - 7)
    }

    return elementArea
  }

  calculateSize(): ElementSize {
    return new ElementSize(this.size, this.size)
  }

  private mouseEnter() {
    this.state = ButtonState.Hover
  }

  private mouseLeave() {
    this.state = ButtonState.Normal
  }

  private mouseDown() {
    if (this.onClick) {
      this.onClick()
    }
  }
}
