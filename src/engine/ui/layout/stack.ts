import {setPaddingProperty, setProperty, UIElement, UIElementProperties} from "../uiElement"
import {ElementArea} from "../elementArea"
import {RenderUIContext} from "../renderUIContext"
import {ElementSize} from "../elementSize"
import {ElementSizeValue} from "../elementSizeValue"
import {UIElementType} from "../uiElementType"
import {nothing, Nothing} from "../../../infrastructure/nothing"
import {Padding} from "../padding"
import {EventHandler, MouseEnter, MouseLeave} from "../../events"
import {UIContext} from "../uiContext"

export function stack(stackProperties: StackProperties | Nothing = nothing, children: readonly UIElement[] | undefined = undefined) {
  return new Stack({...stackProperties, children: children})
}

export interface StackProperties extends UIElementProperties {
  children?: readonly UIElement[]
  spacing?: number
  padding?: Padding | number
  onEnter?: EventHandler
  onLeave?: EventHandler
}

export class Stack extends UIElement {

  private readonly spacing: number = 4
  private readonly padding: Padding = Padding.single(0)
  private readonly onEnter: EventHandler | Nothing = nothing
  private readonly onLeave: EventHandler | Nothing = nothing

  private childrenValue: readonly UIElement[] = []

  readonly elementType: UIElementType = UIElementType.Stack

  get children(): readonly UIElement[] {
    return this.childrenValue
  }

  set children(children: readonly UIElement[]) {
    this.contextOptional?.detachElements(this.childrenValue)
    this.childrenValue = children
    this.contextOptional?.attachElements(this.childrenValue)
  }

  constructor(properties: StackProperties | Nothing = nothing) {
    super(properties)

    if (properties === nothing) return

    this.spacing = setProperty(properties.spacing, this.spacing)
    this.padding = setPaddingProperty(properties.padding, this.padding)
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

    const stackSize = this.stackSize()
    const ratioHeight = stackSize.totalPercentage > 0 ? (area.height - stackSize.contentHeight) / stackSize.totalPercentage : 0

    let top = area.top
    for (let index = 0; index < this.children.length; index++){

      const element = this.children[index]
      if (!element.visible) continue

      const elementSize = element.calculateSize()
      const height = elementSize.height.proportion
        ? elementSize.height.value * ratioHeight
        : elementSize.height.value
      const elementArea = new ElementArea(area.left, top, area.calculateWidth(elementSize.width), height)

      element.render(elementArea, context)

      top += index < this.children.length - 1 ? height + this.spacing : height
    }

    super.renderElement(area, context)

    return area.resize(stackSize.value)
  }

  calculateSize(): ElementSize {
    return this.stackSize().value
  }

  private stackSize() {

    let width = 0
    let widthPercentage = 0
    let height = 0
    let heightPercentage = 0

    for (let index = 0; index < this.children.length; index++) {

      const child = this.children[index]
      if (!child.visible) continue

      const childSize = child.calculateSize()

      if (childSize.height.proportion) {
        heightPercentage += childSize.height.value
      } else {
        height += index == 0 ? childSize.height.value : childSize.height.value
      }

      if (childSize.width.proportion) {
        widthPercentage = Math.max(widthPercentage, childSize.width.value)
      } else {
        width = Math.max(width, childSize.width.value)
      }
    }

    const spacing = (this.children.length - 1) * this.spacing
    const elementWidth = widthPercentage > 0 ? ElementSizeValue.full : new ElementSizeValue(width + this.padding.horizontal)
    const elementHeight = heightPercentage > 0 ? ElementSizeValue.full : new ElementSizeValue(height + spacing + this.padding.vertical)

    return {
      totalPercentage: heightPercentage,
      contentHeight: height + spacing,
      value: new ElementSize(elementWidth, elementHeight)
    }
  }
}
