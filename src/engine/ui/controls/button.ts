import {ElementSizeValue} from "../elementSizeValue"
import {ElementSize} from "../elementSize"
import {ApplicationContext} from "../../applicationContext"
import {ElementArea} from "../elementArea"
import {Colors} from "../../../infrastructure/colors"
import {UIElement} from "../uiElement"
import {UIRenderContext} from "../uiRenderContext"
import {UIElementType} from "../uiElementType"
import {Identifier, nothing} from "../../../infrastructure/nothing"

const defaultHeight = 32

export class Button extends UIElement {

  private titleValue: string

  readonly width: ElementSizeValue
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

  constructor(context: ApplicationContext, id: Identifier, width: ElementSizeValue, title: string) {
    super(context, id)
    this.width = width;
    this.titleValue = title
  }

  protected renderElement(area: ElementArea, context: UIRenderContext) {
    const size: ElementSize = this.calculateSize()
    const elementArea = area.resize(size)
    //context.fillPath(Colors.highlight, elementArea.toPath())
    context.text(Colors.ui.titleText, elementArea, this.titleValue, nothing)
    context.icon(Colors.ui.titleText, 100, 100)
    return elementArea
  }

  calculateSize(): ElementSize {
    return new ElementSize(this.width, new ElementSizeValue(defaultHeight))
  }
}
