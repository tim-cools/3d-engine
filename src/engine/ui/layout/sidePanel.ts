import {UIElement, UIElementProperties} from "../uiElement"
import {ElementSizeValue} from "../elementSizeValue"
import {ElementSize} from "../elementSize"
import {Padding} from "../padding"
import {ElementArea} from "../elementArea"
import {ElementPosition} from "../elementPosition"
import {Colors} from "../../../infrastructure/colors"
import {UIRenderContext} from "../uiRenderContext"
import {Stack} from "./stack"
import {ContentElement} from "./contentElement"
import {UIElementType} from "../uiElementType"
import {Box, IconButton} from "../controls"
import {Icon} from "../rendering/icons"
import {Canvas} from "./canvas"

export enum SidePanelLocation {
  Left,
  Right
}

export interface SidePanelProperties extends UIElementProperties {
  location: SidePanelLocation
  children: UIElement[]
}

export class SidePanel extends ContentElement {

  private readonly expandButton: IconButton
  private readonly stack: Stack
  private readonly box: Box
  private open: boolean = true

  readonly sizeOpen = new ElementSize(new ElementSizeValue(350), new ElementSizeValue(100, true))
  readonly sizeClosed = new ElementSize(new ElementSizeValue(26), new ElementSizeValue(100, true))
  readonly elementType: UIElementType = UIElementType.SidePanel
  readonly location: SidePanelLocation

  get size(): ElementSize {
    return  this.open ? this.sizeOpen : this.sizeClosed
  }

  constructor(properties: SidePanelProperties) {
    super(properties)

    this.location = properties.location
    this.expandButton = new IconButton({
      size: new ElementSizeValue(18),
      icon: this.icon(),
      onClick: () => this.toggleExpand(),
      attach: [
        this.location == SidePanelLocation.Left ? Canvas.right(4) : Canvas.left(4),
        Canvas.top(4)
      ]
    })

    const stackPadding = new Padding(36, 16, 16, 16)
    this.stack = new Stack({spacing: 16, children: properties.children, padding: stackPadding})
    this.box = new Box({size: this.headerSize() })
    this.content = new Canvas({
      elements: [
        this.box,
        this.stack,
        this.expandButton
      ]
    })
  }

  private icon() {
    return this.location == SidePanelLocation.Left
      ? this.open ? Icon.ArrowRight : Icon.ArrowLeft
      : this.open ? Icon.ArrowLeft : Icon.ArrowRight
  }

  protected renderElement(area: ElementArea, context: UIRenderContext) {


    const size = this.size
    const position = this.location == SidePanelLocation.Right
      ? new ElementPosition(area.width - size.width.value, -1)
      : new ElementPosition(-1, -1)

    const elementArea = area.part(position, size)
    const points = elementArea.toPath()
    context.fillPathStroke(Colors.ui.background, Colors.ui.border, 2, points)

    this.content.render(elementArea, context)

    return elementArea
  }

  private toggleExpand() {
    this.open = !this.open
    this.expandButton.icon = this.icon()
    this.stack.visible = this.open
    this.box.size = this.headerSize()
  }

  private headerSize() {
    return this.open
      ? new ElementSize(this.size.width, new ElementSizeValue(24))
      : new ElementSize(this.size.width, new ElementSizeValue(24))
  }
}
