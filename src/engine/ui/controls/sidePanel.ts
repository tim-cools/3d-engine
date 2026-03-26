import {UIElement} from "../uiElement"
import {ElementSizeValue} from "../elementSizeValue"
import {ElementSize} from "../elementSize"
import {Padding} from "../padding"
import {ElementArea} from "../elementArea"
import {ElementPosition} from "../elementPosition"
import {Colors} from "../../../infrastructure/colors"
import {UIRenderContext} from "../uiRenderContext"
import {Stack} from "./stack"
import {ContentElement} from "../layout/contentElement"
import {ApplicationContext} from "../../applicationContext"
import {UIElementType} from "../uiElementType"
import {Identifier} from "../../../infrastructure/nothing"

export enum SidePanelLocation {
  Left,
  Right
}

export class SidePanel extends ContentElement {

  readonly size = new ElementSize(new ElementSizeValue(350), new ElementSizeValue(100, true))
  readonly padding = Padding.single(16)
  readonly elementType: UIElementType = UIElementType.SidePanel

  constructor(context: ApplicationContext, id: Identifier, private location: SidePanelLocation, children: UIElement[]) {
    super(context, id, new Stack(context, id + ".stack", children, 16))
  }

  protected renderElement(area: ElementArea, context: UIRenderContext) {

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
