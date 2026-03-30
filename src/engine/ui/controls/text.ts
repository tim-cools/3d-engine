import {ElementSizeValue} from "../elementSizeValue"
import {ElementSize} from "../elementSize"
import {ElementArea} from "../elementArea"
import {Colors} from "../../../infrastructure/colors"
import {setProperty, UIElement, UIElementProperties} from "../uiElement"
import {UIRenderContext} from "../uiRenderContext"
import {UIElementType} from "../uiElementType"
import {nothing} from "../../../infrastructure/nothing"

const rowHeight = 18

export interface TextProperties extends UIElementProperties {
  width?: ElementSizeValue
  text?: string
}

export class Text extends UIElement {

  private valueValue: string = ""

  readonly width: ElementSizeValue = ElementSizeValue.full
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

  constructor(properties: TextProperties) {
    super(properties)
    this.width = setProperty(properties.width, this.width)
    this.valueValue = setProperty(properties.text, this.valueValue)
  }

  protected renderElement(area: ElementArea, context: UIRenderContext) {
    const size: ElementSize = this.calculateSize()
    const elementArea = area.resize(size)
    //context.fillPath(Colors.highlight, elementArea.toPath())
    context.text(Colors.ui.titleText, elementArea, this.valueValue, nothing)
    return elementArea
  }

  calculateSize(): ElementSize {
    return new ElementSize(this.width, new ElementSizeValue(rowHeight))
  }
}
