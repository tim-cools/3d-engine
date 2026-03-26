import {ContentElement} from "../layout/contentElement"
import {Stack, Text} from "../controls"
import {ElementSizeValue} from "../elementSizeValue"
import {ApplicationContext} from "../../applicationContext"
import {SidePanel, SidePanelLocation} from "../controls/sidePanel"
import {UIElementType} from "../uiElementType"

export class SidePanelLeft extends ContentElement {

  readonly elementType: UIElementType = UIElementType.SidePanelLeft

  constructor(context: ApplicationContext) {
    super(context, "SidePanelLeft")
    this.setContent(this.createElements(context))
  }

  private createElements(context: ApplicationContext) {

    let index = 0
    function text(title: string) {
      return new Text(context, index.toString(), ElementSizeValue.full, title)
    }

    return new SidePanel(context, "side", SidePanelLocation.Left, [
      new Stack(context, "stack", [
        text("TEST 123"),
        text("TEST 456"),
        text("TEST 789"),
        text("TEST 012"),
        text("TEST 345"),
        text("TEST 678"),
        text("TEST 901"),
      ])
    ])
  }
}
