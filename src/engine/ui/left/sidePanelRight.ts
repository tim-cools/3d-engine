import {SidePanel} from "./sidePanel"
import {SceneContext} from "../../scenes/sceneContext"
import {ContentElement} from "../layout/contentElement"
import {SidePanelLocation} from "./sidePanelLocation"
import {Stack, Text} from "../controls"
import {ElementSizeValue} from "../elementSizeValue"
import {Panel} from "../layout/panel"
import {SceneInfo} from "./sceneInfo"

export class SidePanelRight extends ContentElement {

  private readonly infoPanel: Panel

  constructor(context: SceneContext) {
    super(context)

    this.infoPanel = new Panel(context, "Scene: " ,
      new SceneInfo(context)
    )

    this.setContent(
      new SidePanel(context, SidePanelLocation.Right, [
        this.infoPanel
      ])
    )

    context.scene.onUpdate(() => {
      this.infoPanel.title = "Scene: " + context.scene.value.name
    })
  }
}
