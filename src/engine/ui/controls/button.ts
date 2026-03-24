import {ElementSizeValue} from "../elementSizeValue"
import {ElementSize} from "../elementSize"
import {SceneContext} from "../../scenes/sceneContext"
import {ElementArea} from "../elementArea"
import {Colors} from "../../colors"
import {UIElement} from "../uiElement"
import {UIRenderContext} from "../uiRenderContext"

const defaultHeight = 32

export class Button extends UIElement {

  private titleValue: string

  readonly width: ElementSizeValue

  get title(): string {
    return this.titleValue
  }

  set title(value: string) {
    this.titleValue = value
  }

  constructor(context: SceneContext, width: ElementSizeValue, title: string) {
    super(context)
    this.width = width;
    this.titleValue = title
  }

  protected renderElement(area: ElementArea, context: UIRenderContext) {
    const size: ElementSize = this.calculateSize()
    const elementArea = area.resize(size)
    //context.fillPath(Colors.highlight, elementArea.toPath())
    context.text(Colors.ui.titleText, elementArea, this.titleValue)
    return elementArea
  }

  calculateSize(): ElementSize {
    return new ElementSize(this.width, new ElementSizeValue(defaultHeight))
  }
}
