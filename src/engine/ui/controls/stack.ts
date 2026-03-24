import {SceneContext} from "../../scenes/sceneContext"
import {UIElement} from "../uiElement"
import {ElementArea} from "../elementArea"
import {UIRenderContext} from "../uiRenderContext"
import {ElementSize} from "../elementSize"
import {ElementSizeValue} from "../elementSizeValue"
import {ElementPosition} from "../elementPosition"

export class Stack extends UIElement {

  private readonly spacing: number

  constructor(context: SceneContext, private children: readonly UIElement[], spacing: number = 4) {
    super(context)
    this.spacing = spacing
  }

  render(area: ElementArea, context: UIRenderContext) {

    const stackSize = this.stackSize()
    const ratioHeight = stackSize.totalPercentage > 0 ? area.height / stackSize.totalPercentage : 0

    //context.fillPath("green", area.resize(stackSize.value).toPath())

    let top = area.top
    for (let index = 0; index < this.children.length; index++){
      const element = this.children[index]
      const elementSize = element.calculateSize()
      const height = elementSize.height.proportion ? elementSize.height.value * ratioHeight : elementSize.height.value
      const elementArea = new ElementArea(area.left, top, area.calculateWidth(elementSize.width), height)
      element.render(elementArea, context)

      top += index < this.children.length - 1 ? height + this.spacing : height
    }

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
      const childSize = child.calculateSize()

      if (childSize.height.proportion) {
        heightPercentage += childSize.height.value
      } else {
        height += index == 0 ? childSize.height.value : this.spacing + childSize.height.value
      }

      if (childSize.width.proportion) {
        widthPercentage += childSize.width.value
      } else {
        width = Math.max(width, childSize.width.value)
      }
    }

    const elementWidth = widthPercentage > 0 ? ElementSizeValue.full : new ElementSizeValue(width)
    const elementHeight = heightPercentage > 0 ? ElementSizeValue.full : new ElementSizeValue(height)

    return {totalPercentage: heightPercentage, value: new ElementSize(elementWidth, elementHeight)}
  }
}

