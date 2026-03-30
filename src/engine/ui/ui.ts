import {SidePanelRight} from "./content/sidePanelRight"
import {Canvas} from "./layout"
import {UIElementType} from "./uiElementType"
import {SidePanelLeft} from "./content/sidePanelLeft"

export class UI extends Canvas {

  readonly elementType: UIElementType = UIElementType.UI

  constructor() {
    super()
    this.elements = [
      new SidePanelLeft(),
      new SidePanelRight()
    ]
  }
}
