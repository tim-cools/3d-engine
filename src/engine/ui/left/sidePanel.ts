import {UIElement} from "../uiElement"
import {ElementSizeValue} from "../elementSizeValue"
import {ElementSize} from "../elementSize"
import {Padding} from "../padding"
import {SceneContext} from "../../scenes/sceneContext"
import {ElementArea} from "../elementArea"
import {ElementPosition} from "../elementPosition"
import {Colors} from "../../colors"
import {UIRenderContext} from "../uiRenderContext"
import {Stack} from "../controls"
import {ContentElement} from "../layout/contentElement"
import {SidePanelLocation} from "./sidePanelLocation"

export class SidePanel extends ContentElement {

  readonly size = new ElementSize(new ElementSizeValue(350), new ElementSizeValue(100, true))
  readonly padding = Padding.single(16)

  constructor(context: SceneContext, private location: SidePanelLocation, children: UIElement[]) {
    super(context, new Stack(context, children))
  }

  render(area: ElementArea, context: UIRenderContext) {

    const position = this.location == SidePanelLocation.Right
      ? new ElementPosition(area.width - this.size.width.value, -1)
      : new ElementPosition(-1, -1)

    const elementArea = area.part(position, this.size)
    const points = elementArea.toPath()
    context.fillPathStroke(Colors.ui.background, Colors.ui.border, 2, points)

    const contentArea = elementArea.pad(this.padding)
    this.content.render(contentArea, context)

    return elementArea
  }
}
