import {ElementSizeValue} from "../elementSizeValue"
import {Padding} from "../padding"
import {ElementSize} from "../elementSize"
import {SceneContext} from "../../scenes/sceneContext"
import {ElementArea} from "../elementArea"
import {Colors} from "../../colors"
import {UIElement} from "../uiElement"
import {UIRenderContext} from "../uiRenderContext"

export class PanelHeader extends UIElement {

  private titleValue: string

  readonly padding = Padding.both(12, 6)
  readonly size: ElementSize = new ElementSize(new ElementSizeValue(100, true), new ElementSizeValue(25))

  get title(): string {
    return this.titleValue
  }

  set title(value: string) {
    this.titleValue = value
  }

  constructor(context: SceneContext, title: string) {
    super(context)
    this.titleValue = title
  }

  protected renderElement(area: ElementArea, context: UIRenderContext) {
    const elementArea = area.resize(this.size)
    context.fillPath(Colors.ui.titleBackground, elementArea.toPath())
    context.text(Colors.ui.titleText, elementArea.pad(this.padding), this.titleValue)
    return elementArea
  }

  calculateSize(): ElementSize {
    return this.size
  }
}
