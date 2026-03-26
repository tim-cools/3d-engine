import {ElementSizeValue} from "../elementSizeValue"
import {ElementSize} from "../elementSize"
import {ApplicationContext} from "../../applicationContext"
import {ElementArea} from "../elementArea"
import {Colors} from "../../../infrastructure/colors"
import {UIElement} from "../uiElement"
import {UIRenderContext} from "../uiRenderContext"
import {UIElementType} from "../uiElementType"
import {Identifier, nothing, Nothing} from "../../../infrastructure/nothing"
import {Icon} from "../rendering/icons"
import {ButtonState} from "./button"
import {MouseDown, MouseEnter, MouseLeave} from "../../events"

export class IconButton extends UIElement {

  private readonly onClick: (() => void) | Nothing

  private state: ButtonState = ButtonState.Normal

  readonly size: ElementSizeValue
  readonly elementType: UIElementType = UIElementType.Button

  icon: Icon

  get children(): readonly UIElement[] {
    return []
  }

  constructor(context: ApplicationContext, id: Identifier, size: ElementSizeValue, icon: Icon, onClick: (() => void) | Nothing = nothing) {
    super(context, id)
    this.size = size;
    this.icon = icon
    this.onClick = onClick
    this.context.events.subscribe(MouseEnter, this,event => this.mouseEnter())
    this.context.events.subscribe(MouseLeave, this, event => this.mouseLeave())
    this.context.events.subscribe(MouseDown, this, event => this.mouseDown())
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
