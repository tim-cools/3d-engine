import {SceneContext} from "../../scenes/sceneContext"
import {UIElement} from "../uiElement"
import {ElementArea} from "../elementArea"
import {UIRenderContext} from "../uiRenderContext"
import {ElementSize} from "../elementSize"
import {ElementSizeValue} from "../elementSizeValue"
import {ElementPosition} from "../elementPosition"

export class Row extends UIElement {

  private readonly spacing: number = 8

  constructor(context: SceneContext, private children: readonly UIElement[], spacing: number = 8) {
    super(context)
    this.spacing = spacing
  }

  render(area: ElementArea, context: UIRenderContext) {

    const rowSize = this.rowSize()
    const ratioWidth = rowSize.totalPercentage > 0 ? area.width / rowSize.totalPercentage : 0

    //context.fillPath("yellow", area.resize(rowSize.value).toPath())

    let left = area.left
    for (let index = 0; index < this.children.length; index++){
      const element = this.children[index]
      const elementSize = element.calculateSize()
      const width = elementSize.width.proportion ? elementSize.width.value * ratioWidth : elementSize.width.value
      const elementArea = new ElementArea(left, area.top, width, elementSize.height.value)
      element.render(elementArea, context)

      left += index < this.children.length - 1 ? width + this.spacing : width
    }

    return area.resize(rowSize.value)
  }

  calculateSize(): ElementSize {
    return this.rowSize().value
  }

  private rowSize() {

    let width = 0
    let height = 0
    let totalPercentage = 0

    for (let index = 0; index < this.children.length; index++) {
      const child = this.children[index]
      const childSize = child.calculateSize()

      if (childSize.width.proportion) {
        totalPercentage += childSize.width.value
      } else {
        width += index == 0 ? childSize.width.value : this.spacing + childSize.width.value
      }

      if (childSize.height.proportion) {
        console.log('Warning: childSize.height.proportion is not supported in a row')
      }
      height = Math.max(height, childSize.height.value)
    }

    let elementWith = totalPercentage > 0 ? ElementSizeValue.full : new ElementSizeValue(width)
    return {totalPercentage: totalPercentage, value: new ElementSize(elementWith, new ElementSizeValue(height))}
  }
}
