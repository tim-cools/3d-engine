import {ElementSizeValue} from "../elementSizeValue"
import {ElementSize} from "../elementSize"
import {ApplicationContext} from "../../applicationContext"
import {ElementArea} from "../elementArea"
import {Colors} from "../../../infrastructure/colors"
import {UIElement} from "../uiElement"
import {UIRenderContext} from "../uiRenderContext"
import {UIElementType} from "../uiElementType"
import {Identifier} from "../../../infrastructure/nothing"

const rowHeight = 18

export class Text extends UIElement {

  private valueValue: string

  readonly width: ElementSizeValue
  readonly elementType: UIElementType = UIElementType.Text

  get value(): string {
    return this.valueValue
  }

  set value(value: string) {
    this.valueValue = value
  }

  get children(): UIElement[] {
    return []
  }

  constructor(context: ApplicationContext, id: Identifier, width: ElementSizeValue, title: string) {
    super(context, id)
    this.width = width;
    this.valueValue = title
  }

  protected renderElement(area: ElementArea, context: UIRenderContext) {
    const size: ElementSize = this.calculateSize()
    const elementArea = area.resize(size)
    //context.fillPath(Colors.highlight, elementArea.toPath())
    context.text(Colors.ui.titleText, elementArea, this.valueValue)
    return elementArea
  }

  calculateSize(): ElementSize {
    return new ElementSize(this.width, new ElementSizeValue(rowHeight))
  }
}
