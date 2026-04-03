import {ElementSizeValue} from "../elementSizeValue"
import {ElementSize} from "../elementSize"
import {ElementArea} from "../elementArea"
import {Colors} from "../../../infrastructure/colors"
import {setProperty, setSizeProperty, UIElement, UIElementProperties} from "../uiElement"
import {RenderUIContext} from "../renderUIContext"
import {UIElementType} from "../uiElementType"
import {nothing, Nothing} from "../../../infrastructure/nothing"

const rowHeight = 18

export function text(text: string, properties: TextProperties | Nothing = nothing) {
  return new Text({...properties, text: text})
}

export interface TextProperties extends UIElementProperties {
  width?: ElementSizeValue | number
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

  constructor(properties: TextProperties | Nothing = nothing) {
    super(properties)
    if (properties == nothing) return
    this.width = setSizeProperty(properties.width, this.width)
    this.valueValue = setProperty(properties.text, this.valueValue)
  }

  protected renderElement(area: ElementArea, context: RenderUIContext) {

    const size: ElementSize = this.calculateSize()
    const elementArea = area.resize(size)
    context.text(this.valueValue, Colors.ui.titleText, elementArea.position, {})

    return elementArea
  }

  calculateSize(): ElementSize {
    return new ElementSize(this.width, new ElementSizeValue(rowHeight))
  }
}
