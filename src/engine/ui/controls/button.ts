import {ElementSizeValue} from "../elementSizeValue"
import {ElementSize} from "../elementSize"
import {ElementArea} from "../elementArea"
import {Colors} from "../../../infrastructure/colors"
import {setProperty, UIElement, UIElementProperties} from "../uiElement"
import {AlignHorizontal, AlignVertical, UIRenderContext} from "../uiRenderContext"
import {UIElementType} from "../uiElementType"

const defaultHeight = 32

export enum ButtonState {
  Normal,
  Hover,
}

export interface ButtonProperties extends UIElementProperties {
  content?: UIElement
  width?: ElementSizeValue
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
    this.width = setProperty(properties.width, this.width)
    this.titleValue = setProperty(properties.title, this.titleValue)
  }

  protected renderElement(area: ElementArea, context: UIRenderContext) {

    const size: ElementSize = this.calculateSize()
    const elementArea = area.resize(size)

    context.fillPath(Colors.ui.buttonBackground, elementArea.toPath())

    const middle = elementArea.middle()
    context.text(Colors.ui.buttonText, middle.x, middle.y, this.titleValue, textStyle)

    return elementArea
  }

  calculateSize(): ElementSize {
    return new ElementSize(this.width, new ElementSizeValue(defaultHeight))
  }
}
