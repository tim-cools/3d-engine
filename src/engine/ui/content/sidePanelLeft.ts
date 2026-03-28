import {ContentElement} from "../layout/contentElement"
import {Stack} from "../controls"
import {ApplicationContext} from "../../applicationContext"
import {SidePanel, SidePanelLocation} from "../controls/sidePanel"
import {UIElementType} from "../uiElementType"
import {Panel} from "../layout/panel"
import {ObjectsList} from "./objectsList"
import {ObjectDetails} from "./objectDetails"
import {ScenesList} from "./scenesList"

export class SidePanelLeft extends ContentElement {

  readonly elementType: UIElementType = UIElementType.SidePanelLeft

  constructor(context: ApplicationContext) {
    super(context, "sidePanelLeft")
    this.content = SidePanelLeft.createElements(context)
  }

  private static createElements(context: ApplicationContext) {
    return new SidePanel(context, "side", SidePanelLocation.Left, [
      new Stack(context, "stack", [
        new ScenesList(context),
        new ObjectsList(context),
        new ObjectDetails(context)
      ], 16)
    ])
  }
}
