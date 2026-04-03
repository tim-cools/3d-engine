import {Canvas} from "./layout"
import {UIElementType} from "./uiElementType"
import {sidePanelLeft, SidePanelLeft} from "./content/sidePanelLeft"
import {sidePanelRight, SidePanelRight} from "./content/sidePanelRight"
import {Point2D} from "../models"

export class UI extends Canvas {

  private readonly sidePanelLeft: SidePanelLeft
  private readonly sidePanelRight: SidePanelRight

  readonly elementType: UIElementType = UIElementType.UI

  constructor() {
    super()
    this.sidePanelLeft = sidePanelLeft()
    this.sidePanelRight = sidePanelRight()
    this.elements = [this.sidePanelLeft, this.sidePanelRight]
  }

  pointInUI(point: Point2D) {
    return !!this.sidePanelLeft.content?.lastArea.contains(point)
        || !!this.sidePanelRight.content?.lastArea.contains(point)
  }
}
