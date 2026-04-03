import {UIElement, UIElementProperties} from "../uiElement"
import {ElementSizeValue, fullSize} from "../elementSizeValue"
import {ElementSize} from "../elementSize"
import {Padding} from "../padding"
import {ElementArea} from "../elementArea"
import {Colors} from "../../../infrastructure/colors"
import {RenderUIContext} from "../renderUIContext"
import {stack, Stack} from "./stack"
import {ContentElement} from "./contentElement"
import {UIElementType} from "../uiElementType"
import {box, Box, iconButton, IconButton} from "../controls"
import {Icon} from "../rendering/icons"
import {canvas, Canvas} from "./canvas"

export enum SidePanelLocation {
  Left,
  Right
}

export function sidePanel(location: SidePanelLocation, id: string, children: UIElement[]) {
  return new SidePanel({
    id: id,
    location: location,
    children: children
  })
}

export interface SidePanelProperties extends UIElementProperties {
  location: SidePanelLocation
  children: UIElement[]
}

export class SidePanel extends ContentElement {

  private readonly collapseButton: IconButton
  private readonly list: Stack
  private readonly header: Box
  private readonly headerPanel : Canvas

  private open: boolean = true

  readonly sizeOpen = new ElementSize(350, fullSize)
  readonly sizeClosed = new ElementSize(26, fullSize)
  readonly elementType: UIElementType = UIElementType.SidePanel
  readonly location: SidePanelLocation

  get size(): ElementSize {
    return this.open ? this.sizeOpen : this.sizeClosed
  }

  constructor(properties: SidePanelProperties) {
    super(properties)

    this.location = properties.location
    this.collapseButton = iconButton(this.icon(), {
      id: "Collapse",
      size: 18,
      onClick: () => this.toggleExpand(),
      attach: [
        this.location == SidePanelLocation.Left ? Canvas.right(4) : Canvas.left(4),
        Canvas.top(4)
      ]
    })

    const stackPadding = Padding.single(16)
    const headerSize = this.headerSize()

    this.list = stack({id: "Panels", spacing: 16, padding: stackPadding}, properties.children)
    this.header = box({id: "Header", size: headerSize})
    this.headerPanel = canvas({id: "SidePanelHeader", size: headerSize},
      [this.header, this.collapseButton])

    this.content = stack({spacing: 0}, [this.headerPanel,this.list])
  }

  calculateSize(): ElementSize {
    return new ElementSize(this.size.width, ElementSizeValue.full)
  }

  private icon() {
    return this.location == SidePanelLocation.Left
      ? this.open ? Icon.ArrowLeft : Icon.ArrowRight
      : this.open ? Icon.ArrowRight : Icon.ArrowLeft
  }

  protected renderElement(area: ElementArea, context: RenderUIContext) {
    const points = area.toPath()
    context.fillPathStroke(points, 2, Colors.ui.background, Colors.ui.border)
    super.renderElement(area, context)
    return area
  }

  private toggleExpand() {
    this.open = !this.open
    this.collapseButton.icon = this.icon()
    this.list.visible = this.open

    const headerSize = this.headerSize()
    this.header.size = headerSize
    this.headerPanel.size = headerSize
  }

  private headerSize() {
    return new ElementSize(this.size.width, new ElementSizeValue(24))
  }
}
