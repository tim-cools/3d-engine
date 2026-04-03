import {UIElement, UIElementProperties} from "../uiElement"
import {ElementArea} from "../elementArea"
import {RenderUIContext} from "../renderUIContext"
import {ElementSize} from "../elementSize"
import {ElementSizeValue} from "../elementSizeValue"
import {UIElementType} from "../uiElementType"
import {scrollBar, ScrollBar} from "./scrollBar"
import {Colors} from "../../../infrastructure/colors"

export function scrollablePanel(content: UIElement, properties: ScrollablePanelProperties | undefined = undefined) {
  return new ScrollablePanel({
    ...properties,
    content: content
  })
}

export interface ScrollablePanelProperties extends UIElementProperties {
  minHeight?: number
  content: UIElement
}

export class ScrollablePanel extends UIElement {

  private readonly spacing = 4

  private readonly scrollBar: ScrollBar
  private readonly content: UIElement

  readonly elementType: UIElementType = UIElementType.ScrollablePanel
  contentTop: number = 0

  get children(): readonly UIElement[] {
    return [this.content, this.scrollBar]
  }

  constructor(properties: ScrollablePanelProperties) {
    super(properties)
    this.scrollBar = scrollBar(contentTop => this.contentTop = contentTop)
    this.content = properties.content
  }

  protected renderElement(area: ElementArea, context: RenderUIContext) {

    let contentSize = this.content.calculateSize()
    if (contentSize.height.proportion) {
      throw new Error("contentSize.height.proportion = true. Scenario not implemented")
    }
    const height = contentSize.height.value
    const width =  contentSize.width.proportion ? area.width - this.scrollBar.width - this.spacing : area.width

    if (height > 0) {
      const contentContext = context.createImage(width, height, area.position)
      const contentArea = new ElementArea(0, 0, width, height)
      contentContext.fillRectangle(Colors.ui.listBackground, contentArea)
      this.content.render(contentArea, contentContext)

      context.drawImage(contentContext, contentArea.addTop(this.contentTop), area)

      const scrollBarArea = new ElementArea(area.left + area.width - this.scrollBar.width, area.top, this.scrollBar.width, area.height)
      this.scrollBar.visibleHeight = area.height
      this.scrollBar.contentHeight = height
      this.scrollBar.render(scrollBarArea, context)
    }

    return area
  }

  calculateSize(): ElementSize {
    return new ElementSize(ElementSizeValue.full, ElementSizeValue.full)
  }
}
