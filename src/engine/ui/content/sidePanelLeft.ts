import {ContentElement} from "../layout"
import {Stack, SidePanel, SidePanelLocation} from "../layout"
import {UIElementType} from "../uiElementType"
import {ObjectsList} from "./objectsList"
import {ObjectDetails} from "./objectDetails"
import {ScenesList} from "./scenesList"
import {UIRenderContext} from "../uiRenderContext"
import {ElementArea} from "../elementArea"

export class SidePanelLeft extends ContentElement {

  readonly elementType: UIElementType = UIElementType.SidePanelLeft

  constructor() {
    super()
    this.content = SidePanelLeft.createElements()
  }

  private static createElements() {
    return new SidePanel({
      location: SidePanelLocation.Left,
      children: [
        new Stack({
          spacing: 16,
          children: [
            new ScenesList(),
            new ObjectsList(),
            new ObjectDetails()
          ]
        })
      ]
    })
  }

  protected renderElement(area: ElementArea, context: UIRenderContext): ElementArea {
    return super.renderElement(area, context)
  }
}
