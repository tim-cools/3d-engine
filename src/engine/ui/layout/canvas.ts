import {ElementArea} from "../elementArea"
import {ElementSize} from "../elementSize"
import {ElementSizeValue} from "../elementSizeValue"
import {RenderUIContext} from "../renderUIContext"
import {setProperty, UIElement, UIElementProperties} from "../uiElement"
import {UIElementType} from "../uiElementType"
import {nothing, Nothing} from "../../../infrastructure/nothing"
import {createAttachmentProperty} from "../attachmentProperty"

export function canvas(canvasProperties: CanvasProperties, elements: readonly UIElement[] | undefined = undefined) {
  return new Canvas({...canvasProperties, elements: elements})
}

export interface CanvasProperties extends UIElementProperties {
  elements?: readonly UIElement[]
  size?: ElementSize
}

export class Canvas extends UIElement {

  static left = createAttachmentProperty<number>("left")
  static right = createAttachmentProperty<number>("right")
  static top = createAttachmentProperty<number>("top")
  static bottom = createAttachmentProperty<number>("bottom")

  private elementsValue: readonly UIElement[] = []

  size: ElementSize | Nothing = nothing
  readonly elementType: UIElementType = UIElementType.Canvas

  get elements(): readonly UIElement[] {
    return this.elementsValue
  }

  set elements(elements: readonly UIElement[]) {
    this.contextOptional?.detachElements(this.elementsValue)
    this.elementsValue = elements
    this.contextOptional?.attachElements(this.elementsValue)
  }

  get children(): readonly UIElement[] {
    return this.elementsValue
  }

  constructor(properties: CanvasProperties | Nothing = nothing) {
    super(properties)
    if (properties === nothing) return

    this.elementsValue = setProperty(properties.elements, this.elementsValue)
    this.size = setProperty(properties.size, this.size)
  }

  calculateSize(): ElementSize {
    return this.size ?? new ElementSize(ElementSizeValue.full, ElementSizeValue.full)
  }

  protected renderElement(area: ElementArea, context: RenderUIContext): ElementArea {
    this.renderElements(area, context)
    return area
  }

  protected renderElements(area: ElementArea, context: RenderUIContext) {
    for (const element of this.elements) {
      this.renderChild(element, area, context)
    }
  }

  private renderChild(element: UIElement, area: ElementArea, context: RenderUIContext) {
    if (!element.visible) return
    const childArea = this.calculateChildArea(element, area)
    element.render(childArea, context)
  }

  private calculateChildArea(element: UIElement, area: ElementArea): ElementArea {

    function notSupported() {
      const anchors: string[] = []
      if (left != undefined) anchors.push("left")
      if (right != undefined) anchors.push("right")
      if (top != undefined) anchors.push("top")
      if (bottom != undefined) anchors.push("bottom")
      throw new Error("Invalid anchors: " + anchors.join(", "))
    }

    function calculateLeft(left: number) {
      if (right != undefined || (top != undefined && bottom != undefined)) {
        notSupported()
      } else if (top != undefined) {
        return new ElementArea(area.left + left, area.top + top, width, height)
      } else if (bottom != undefined) {
        const topFromBottom = area.height - height - bottom
        return new ElementArea(area.left + left, area.top + topFromBottom, width, height)
      }
      return new ElementArea(area.left + left, area.top, width, height)
    }

    function calculateRight(right: number) {
      const leftFromRight = area.left + area.width - width - right
      if (left != undefined || (top != undefined && bottom != undefined)) {
        notSupported()
      } else if (top != undefined) {
        return new ElementArea(leftFromRight, area.top + top, width, height)
      } else if (bottom != undefined) {
        return new ElementArea(leftFromRight, area.top + area.height - height - bottom, width, height)
      }
      return new ElementArea(leftFromRight, area.top, width, height)
    }

    function calculateTop(top: number) {
      if (bottom != undefined) {
        notSupported()
      }
      return new ElementArea(area.left, area.top + top, width, height)
    }

    function calculateBottom(bottom: number) {
      if (top != undefined) {
        notSupported()
      }
      const topFromBottom = area.top + area.height - height - bottom
      return new ElementArea(area.left, topFromBottom, width, height)
    }

    const left = element.attachmentPropertyValue(Canvas.left)
    const right = element.attachmentPropertyValue(Canvas.right)
    const top = element.attachmentPropertyValue(Canvas.top)
    const bottom = element.attachmentPropertyValue(Canvas.bottom)
    const size = element.calculateSize()
    const width = area.calculateWidth(size.width)
    const height = area.calculateHeight(size.height)

    if (left != undefined) {
      return calculateLeft(left)
    } else if (right != undefined) {
      return calculateRight(right)
    } else  if (top != undefined) {
      return calculateTop(top)
    } else if (bottom != undefined) {
      return calculateBottom(bottom)
    }
    return new ElementArea(area.left, area.top, width, height)
  }
}

