import {ApplicationContext} from "../../applicationContext"
import {ContentElement} from "../layout/contentElement"
import {Stack, Text} from "../controls"
import {ElementSizeValue} from "../elementSizeValue"
import {Panel} from "../layout/panel"
import {SceneInfo} from "./sceneInfo"
import {ScenesInfo} from "./scenesInfo"
import {SceneStateIdentifier} from "../../state/sceneState"
import {SidePanel, SidePanelLocation} from "../controls/sidePanel"
import {UIElementType} from "../uiElementType"

export class SidePanelRight extends ContentElement {

  private readonly infoPanel: Panel

  readonly elementType: UIElementType = UIElementType.SidePanelRight

  constructor(context: ApplicationContext) {
    super(context, "SidePanelRight")

    this.infoPanel = new Panel(context, "infoPanel", "Scene: " ,
      new SceneInfo(context)
    )

    this.setContent(
      new SidePanel(context, "sidepanel", SidePanelLocation.Right, [
        new Panel(context, "instructions", "Instructions",
          SidePanelRight.instructionsInfo(context)
        ),
        this.infoPanel,
        new Panel(context, "scenes", "Scenes",
          new ScenesInfo(context)
        ),
      ])
    )

    context.state(SceneStateIdentifier).onUpdate(state => {
      this.infoPanel.title = "Scene: " + state.name
    })
  }

  private static instructionsInfo(context: ApplicationContext) {

    let index = 0
    function text(title: string) {
      return new Text(context, index.toString(), ElementSizeValue.full, title)
    }

    return new Stack(context, "stack", [
      text("Fun with 3D graphics and typescript."),
      text("  Mouse: rotate world (+shift)"),
      text("  Keys 0-9: change scene"),
      text("  Keys arrows: move world (+shift))"),
      text("  x: toggle axis"),
      text("  b: toggle boundaries"),
      text("  r: change render style"),
      text("  a: change agorithm"),
    ])
  }
}
