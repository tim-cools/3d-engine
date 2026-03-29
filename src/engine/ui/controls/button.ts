import {ElementSizeValue} from "../elementSizeValue"
import {ElementSize} from "../elementSize"
import {ApplicationContext} from "../../applicationContext"
import {ElementArea} from "../elementArea"
import {Colors} from "../../../infrastructure/colors"
import {setProperty, UIElement, UIElementProperties} from "../uiElement"
import {UIRenderContext} from "../uiRenderContext"
import {UIElementType} from "../uiElementType"
import {nothing} from "../../../infrastructure/nothing"

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
    //context.fillPath(Colors.highlight, elementArea.toPath())
    context.text(Colors.ui.titleText, elementArea, this.titleValue, nothing)
    return elementArea
  }

  calculateSize(): ElementSize {
    return new ElementSize(this.width, new ElementSizeValue(defaultHeight))
  }
}
