import {ApplicationContext} from "../applicationContext"
import {SidePanelRight} from "./content/sidePanelRight"
import {Canvas} from "./layout/canvas"
import {UIElementType} from "./uiElementType"
import {SidePanelLeft} from "./content/sidePanelLeft"

export class UI extends Canvas {

  readonly elementType: UIElementType = UIElementType.UI

  constructor(context: ApplicationContext) {
    super(context, "UI")
    this.setElements([
      new SidePanelLeft(context),
      new SidePanelRight(context)
    ])
  }
}
