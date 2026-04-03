import {ElementSizeValue} from "../elementSizeValue"
import {ElementSize} from "../elementSize"
import {ElementArea} from "../elementArea"
import {Colors} from "../../../infrastructure/colors"
import {setProperty, setSizeProperty, UIElement, UIElementProperties} from "../uiElement"
import {AlignHorizontal, AlignVertical, RenderUIContext} from "../renderUIContext"
import {UIElementType} from "../uiElementType"

const defaultHeight = 32

export function button(title: string, properties: ButtonProperties) {
  return new Button({
    ...properties,
    title: title
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
}

const textStyle = {alignHorizontal: AlignHorizontal.Centre, alignVertical: AlignVertical.Middle}

export class Button extends UIElement {

  private titleValue: string = ""

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
  }

  protected renderElement(area: ElementArea, context: RenderUIContext) {

    const size: ElementSize = this.calculateSize()
    const elementArea = area.resize(size)

    context.fillPath(elementArea.toPath(), Colors.ui.buttonBackground)

    const middle = elementArea.middle()
    context.text(this.titleValue, Colors.ui.buttonText, middle, textStyle)

    return elementArea
  }

  calculateSize(): ElementSize {
    return new ElementSize(this.width, new ElementSizeValue(defaultHeight))
  }
}
