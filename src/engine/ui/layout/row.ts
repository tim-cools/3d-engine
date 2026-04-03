import {setProperty, UIElement, UIElementProperties} from "../uiElement"
import {ElementArea} from "../elementArea"
import {RenderUIContext} from "../renderUIContext"
import {ElementSize} from "../elementSize"
import {ElementSizeValue} from "../elementSizeValue"
import {UIElementType} from "../uiElementType"
import {Nothing, nothing} from "../../../infrastructure/nothing"
import {EventHandler, MouseEnter, MouseLeave} from "../../events"
import {UIContext} from "../uiContext"
import {Padding} from "../padding"

export function row(rowProperties: RowProperties, children: UIElement[] | undefined = undefined) {
  return new Row({...rowProperties, children: children})
}

export interface RowProperties extends UIElementProperties {
  children?: readonly UIElement[]
  spacing?: number
  padding?: Padding | number
  onEnter?: EventHandler
  onLeave?: EventHandler
}

export class Row extends UIElement {

  private readonly spacing: number = 4
  private readonly padding: Padding = Padding.single(0)
  private readonly onEnter: EventHandler | Nothing = nothing
  private readonly onLeave: EventHandler | Nothing = nothing

  private childrenValue: readonly UIElement[] = []

  readonly elementType: UIElementType = UIElementType.Row

  get children(): readonly UIElement[] {
    return this.childrenValue
  }

  set children(children: readonly UIElement[]) {
    this.contextOptional?.detachElements(this.childrenValue)
    this.childrenValue = children
    this.contextOptional?.attachElements(this.childrenValue)
  }

  constructor(properties: RowProperties | Nothing = nothing) {
    super(properties)

    if (properties === nothing) return

    this.spacing = setProperty(properties.spacing, this.spacing)
    this.padding = Padding.parse(setProperty(properties.padding, this.padding))
    this.childrenValue = setProperty(properties.children, this.childrenValue)
    this.onEnter = setProperty(properties.onEnter, nothing)
    this.onLeave = setProperty(properties.onLeave, nothing)
  }

  protected contextAttached(context: UIContext) {
    if (this.onEnter != nothing) {
      context.events.subscribe(MouseEnter, event => this.callOnEnter(), this)
    }
    if (this.onLeave != nothing) {
      context.events.subscribe(MouseLeave, event => this.callOnLeave(), this)
    }
  }

  private callOnLeave() {
    return this.onLeave?.call(this)
  }

  private callOnEnter() {
    return this.onEnter?.call(this)
  }

  protected renderElement(area: ElementArea, context: RenderUIContext) {

    area = area.pad(this.padding)

    const rowSize = this.rowSize()
    const ratioWidth = rowSize.totalPercentage > 0 ? (area.width - rowSize.contentWidth) / rowSize.totalPercentage : 0

    //context.fillPath(area.toPath(), Colors.highlightMax)

    let left = area.left
    for (let index = 0; index < this.children.length; index++){

      const element = this.children[index]
      if (!element.visible) continue

      const elementSize = element.calculateSize()
      const width = elementSize.width.proportion
        ? elementSize.width.value * ratioWidth
        : elementSize.width.value
      const elementArea = new ElementArea(left, area.top, width, area.calculateHeight(elementSize.height))

      element.render(elementArea, context)

      left += index < this.children.length - 1 ? width + this.spacing : width
    }

    super.renderElement(area, context)

    return area.resize(rowSize.value)
  }

  calculateSize(): ElementSize {
    return this.rowSize().value
  }

  private rowSize() {

    let width = 0
    let widthPercentage = 0
    let height = 0
    let heightPercentage = 0

    for (let index = 0; index < this.children.length; index++) {

      const child = this.children[index]
      if (!child.visible) continue

      const childSize = child.calculateSize()

      if (childSize.width.proportion) {
        widthPercentage += childSize.width.value
      } else {
        width += index == 0 ? childSize.width.value : childSize.width.value
      }

      if (childSize.height.proportion) {
        heightPercentage = Math.max(heightPercentage, childSize.height.value)
      } else {
        height = Math.max(height, childSize.height.value)
      }
    }

    const spacing = (this.children.length - 1) * this.spacing
    const elementWidth = widthPercentage > 0 ? ElementSizeValue.full : new ElementSizeValue(width + spacing + this.padding.horizontal)
    const elementHeight = heightPercentage > 0 ? ElementSizeValue.full : new ElementSizeValue(height + this.padding.vertical)

    return {
      totalPercentage: widthPercentage,
      contentWidth: width + spacing,
      value: new ElementSize(elementWidth, elementHeight)
    }
  }
}
