import {setProperty, UIElement, UIElementProperties} from "../uiElement"
import {UIElementType} from "../uiElementType"
import {Colors} from "../../../infrastructure/colors"
import {ElementSize} from "../elementSize"
import {fullSize} from "../elementSizeValue"
import {ElementArea} from "../elementArea"
import {RenderUIContext} from "../renderUIContext"
import {UIContext} from "../uiContext"
import {MouseDown, MouseDrag} from "../../events"

export function scrollBar(onContentTopChanged: (value: number) => void, properties: ScrollBarProperties | undefined = undefined) {
  return new ScrollBar({
    ...properties,
    onContentTopChanged: onContentTopChanged
  })
}

export interface ScrollBarProperties extends UIElementProperties {
  maxValue?: number
  onContentTopChanged?: (value: number) => void
}

export class ScrollBar extends UIElement {

  private readonly onContentTopChanged: ((value: number) => void) | undefined

  readonly width: number = 10
  readonly sliderMinHeight: number = 25

  contentTop: number = 0
  visibleHeight: number = 100
  contentHeight: number = 200

  readonly elementType: UIElementType = UIElementType.ScrollBar
  readonly children: readonly UIElement[] = []

  constructor(properties: ScrollBarProperties | undefined = undefined) {
    super(properties)
    this.onContentTopChanged = setProperty(properties?.onContentTopChanged, undefined)
  }

  calculateSize(): ElementSize {
    return new ElementSize(this.width, fullSize)
  }

  protected contextAttached(context: UIContext) {
    context.events.subscribe(MouseDrag, event => this.applyOffset(event.offsetY, this.lastArea), this)
    context.events.subscribe(MouseDown, event => this.checkUpDown(event), this)
  }

  calculateSliderArea(area: ElementArea) {

    const sliderMaxHeight = area.height
    const sliderHeight = Math.max(this.sliderMinHeight, Math.min(sliderMaxHeight, this.visibleHeight / this.contentHeight * sliderMaxHeight))
    const restHeight = sliderMaxHeight - sliderHeight
    const rest = this.contentHeight - this.visibleHeight
    const heightValue = rest > 0 ? restHeight / rest : 0
    const top = Math.min(restHeight, heightValue * this.contentTop)

    return new ElementArea(area.left, area.top + top, this.width, sliderHeight)
  }

  applyOffset(offsetY: number, area: ElementArea) {

    const sliderMaxHeight = area.height
    const sliderHeight = Math.max(this.sliderMinHeight, Math.min(sliderMaxHeight, this.visibleHeight / this.contentHeight * sliderMaxHeight))
    const restHeight = sliderMaxHeight - sliderHeight
    const rest = this.contentHeight - this.visibleHeight
    const offset = restHeight > 0 ? (offsetY / restHeight) * rest : 0

    this.contentTop = Math.max(0, Math.min(rest, this.contentTop + offset))

    if (this.onContentTopChanged != undefined) {
      this.onContentTopChanged(this.contentTop)
    }

    console.log(`contentTop: ${this.contentTop} -- ${offsetY}`)
  }

  protected renderElement(area: ElementArea, context: RenderUIContext): ElementArea {

    //context.fillRectangle(Colors.highlightMax, area)
    const sliderArea = this.calculateSliderArea(area)

    context.fillRoundRectangle(Colors.ui.buttonBackground, sliderArea, this.width / 2)

    return super.renderElement(area, context)
  }

  private checkUpDown(event: MouseDown) {
    const slider = this.calculateSliderArea(this.lastArea)
    if (event.point.y < slider.top) {
      this.applyOffset(-this.visibleHeight / 10, this.lastArea)
    } else if (event.point.y > slider.bottom) {
      this.applyOffset(this.visibleHeight / 10, this.lastArea)
    }
  }
}
