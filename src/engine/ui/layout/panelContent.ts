import {UIElement} from "../uiElement"
import {Padding} from "../padding"
import {SceneContext} from "../../scenes/sceneContext"
import {ElementArea} from "../elementArea"
import {UIRenderContext} from "../uiRenderContext"
import {Colors} from "../../colors"
import {ElementSize} from "../elementSize"
import {ElementSizeValue} from "../elementSizeValue"

export class PanelContent extends UIElement {

  readonly padding = Padding.single(12)

  constructor(context: SceneContext, private content: UIElement) {
    super(context)
  }

  render(area: ElementArea, context: UIRenderContext) {

    const size = this.calculateSize()
    const elementArea = area.resize(size)
    context.fillPath(Colors.ui.tabBackground, elementArea.toPath())

    const contentArea = elementArea.pad(this.padding)
    this.content.render(contentArea, context)
    return area
  }

  calculateSize(): ElementSize {

    const childSize = this.content.calculateSize()
    const height =  this.padding.top + childSize.height.value + this.padding.bottom

    return new ElementSize(ElementSizeValue.full, new ElementSizeValue(height))
  }
}
