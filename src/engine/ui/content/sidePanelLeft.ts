import {ContentElement, sidePanel, stack} from "../layout"
import {SidePanelLocation} from "../layout"
import {UIElementType} from "../uiElementType"
import {objectsList} from "./objectsList"
import {objectDetails} from "./objectDetails"
import {scenesList} from "./scenesList"
import {RenderUIContext} from "../renderUIContext"
import {ElementArea} from "../elementArea"

export function sidePanelLeft() {
  return new SidePanelLeft()
}

export class SidePanelLeft extends ContentElement {

  readonly elementType: UIElementType = UIElementType.SidePanelLeft

  constructor() {
    super()
    this.content = SidePanelLeft.createElements()
  }

  private static createElements() {
    return sidePanel(SidePanelLocation.Left, "Left", [
      stack({
        spacing: 16
      }, [
        scenesList(),
        objectsList(),
        objectDetails()
      ])
    ])
  }

  protected renderElement(area: ElementArea, context: RenderUIContext): ElementArea {

    const child = super.renderElement(area, context)
//   const image = context.createImage(100, 100)
//    image.fillRectangle("green", ElementArea.square(100))
//    context.drawImage(image, new ElementArea(0, 0, 100, 100),  area)
    return child
  }
}
