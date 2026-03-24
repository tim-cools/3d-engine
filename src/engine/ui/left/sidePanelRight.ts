import {SidePanel} from "./sidePanel"
import {SceneContext} from "../../scenes/sceneContext"
import {ContentElement} from "../layout/contentElement"
import {SidePanelLocation} from "./sidePanelLocation"
import {Stack, Text} from "../controls"
import {ElementSizeValue} from "../elementSizeValue"
import {Panel} from "../layout/panel"
import {SceneInfo} from "./sceneInfo"
import {ScenesInfo} from "./scenesInfo"

export class SidePanelRight extends ContentElement {

  private readonly infoPanel: Panel

  constructor(context: SceneContext) {
    super(context)

    this.infoPanel = new Panel(context, "Scene: " ,
      new SceneInfo(context)
    )

    this.setContent(
      new SidePanel(context, SidePanelLocation.Right, [
        new Panel(context, "Instructions",
          this.instructionsInfo(context)
        ),
        this.infoPanel,
        new Panel(context, "Scenes",
          new ScenesInfo(context)
        ),
      ])
    )

    context.scene.onUpdate(() => {
      this.infoPanel.title = "Scene: " + context.scene.value.name
    })
  }

  private instructionsInfo(context: SceneContext) {
    return new Stack(context, [
      new Text(context, ElementSizeValue.full, "Fun with 3D graphics and typescript."),
      new Text(context, ElementSizeValue.full, "  Mouse: rotate world (+shift)"),
      new Text(context, ElementSizeValue.full, "  Keys 0-9: change scene"),
      new Text(context, ElementSizeValue.full, "  Keys arrows: move world (+shift))"),
      new Text(context, ElementSizeValue.full, "  x: toggle axis"),
      new Text(context, ElementSizeValue.full, "  b: toggle boundaries"),
      new Text(context, ElementSizeValue.full, "  r: change render style"),
      new Text(context, ElementSizeValue.full, "  a: change agorithm"),
    ])
  }
}
