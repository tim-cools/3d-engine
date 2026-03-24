import {SceneContext} from "../scenes/sceneContext"
import {SidePanelLeft} from "./left/sidePanelLeft"
import {SidePanelRight} from "./left/sidePanelRight"
import {Canvas} from "./layout/canvas"

export class UI extends Canvas {
  constructor(context: SceneContext) {
    super(context)
    this.setElements([
      //new SidePanelLeft(context),
      new SidePanelRight(context)
    ])
  }
}
