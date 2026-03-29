import {ContentElement} from "../layout/contentElement"
import {Stack} from "../controls"
import {SidePanel, SidePanelLocation} from "../controls/sidePanel"
import {UIElementType} from "../uiElementType"
import {ObjectsList} from "./objectsList"
import {ObjectDetails} from "./objectDetails"
import {ScenesList} from "./scenesList"

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
}
