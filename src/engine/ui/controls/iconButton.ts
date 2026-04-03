import {ElementSizeValue} from "../elementSizeValue"
import {ElementSize} from "../elementSize"
import {ElementArea} from "../elementArea"
import {Colors} from "../../../infrastructure/colors"
import {setProperty, setSizeProperty, UIElement, UIElementProperties} from "../uiElement"
import {RenderUIContext} from "../renderUIContext"
import {UIElementType} from "../uiElementType"
import {nothing, Nothing} from "../../../infrastructure/nothing"
import {Icon} from "../rendering/icons"
import {ButtonState} from "./button"
import {MouseDown, MouseEnter, MouseLeave} from "../../events"
import {UIContext} from "../uiContext"

export function iconButton(icon: Icon, iconButtonProperties: IconButtonProperties) {
  return new IconButton({
    ...iconButtonProperties,
    icon: icon
  })
}

export interface IconButtonProperties extends UIElementProperties {
  size?: ElementSizeValue | number
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
    this.size = setSizeProperty(properties.size, this.size)
    this.icon = setProperty(properties.icon, this.icon)
    this.onClick = setProperty(properties.onClick, this.onClick)
  }

  protected contextAttached(context: UIContext) {
    context.events.subscribe(MouseEnter, () => this.mouseEnter(), this)
    context.events.subscribe(MouseLeave, () => this.mouseLeave(), this)
    context.events.subscribe(MouseDown, () => this.mouseDown(), this)
  }

  protected renderElement(area: ElementArea, context: RenderUIContext) {

    const size: ElementSize = this.calculateSize()
    const elementArea = area.resize(size)

    if (this.state == ButtonState.Hover) {
      context.fillRectangle(Colors.ui.buttonBackground, elementArea)
      context.icon(this.icon, Colors.ui.buttonText, area.position, area.width - 7)
    } else {
      context.icon(this.icon, Colors.ui.text, area.position, area.width - 7)
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
