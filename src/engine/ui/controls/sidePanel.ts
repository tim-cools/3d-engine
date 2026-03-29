import {UIElement, UIElementProperties} from "../uiElement"
import {ElementSizeValue} from "../elementSizeValue"
import {ElementSize} from "../elementSize"
import {Padding} from "../padding"
import {ElementArea} from "../elementArea"
import {ElementPosition} from "../elementPosition"
import {Colors} from "../../../infrastructure/colors"
import {UIRenderContext} from "../uiRenderContext"
import {Stack} from "./stack"
import {ContentElement} from "../layout/contentElement"
import {UIElementType} from "../uiElementType"

export enum SidePanelLocation {
  Left,
  Right
}

export interface SidePanelProperties extends UIElementProperties {
  location: SidePanelLocation
  children: UIElement[]
}

export class SidePanel extends ContentElement {

  readonly size = new ElementSize(new ElementSizeValue(350), new ElementSizeValue(100, true))
  readonly padding = Padding.single(16)
  readonly elementType: UIElementType = UIElementType.SidePanel
  readonly location: SidePanelLocation

  constructor(properties: SidePanelProperties) {
    super({
      id: properties?.id,
      content: new Stack({spacing: 16, children: properties.children})
    })
    this.location = properties.location
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
