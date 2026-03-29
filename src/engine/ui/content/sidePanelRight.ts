import {ApplicationContext} from "../../applicationContext"
import {ContentElement} from "../layout/contentElement"
import {Stack, Text} from "../controls"
import {ElementSizeValue} from "../elementSizeValue"
import {Panel} from "../layout/panel"
import {SidePanel, SidePanelLocation} from "../controls/sidePanel"
import {UIElementType} from "../uiElementType"

export class SidePanelRight extends ContentElement {

  readonly elementType: UIElementType = UIElementType.SidePanelRight

  constructor() {
    super()

    this.content =
      new SidePanel({
        location: SidePanelLocation.Right,
        children: [
          new Panel({
            title: "Instructions",
            content: SidePanelRight.instructionsInfo()
          })
        ]
      })
  }

  private static instructionsInfo() {

    function text(title: string) {
      return new Text({width: ElementSizeValue.full, text: title})
    }

    return new Stack({
      children: [
        text("Fun with 3D graphics and typescript."),
        text("  Mouse: rotate world (+shift)"),
        text("  Keys arrows: move world (+shift))"),
        text("  Select objects to change render settings"),
      ]
    })
  }
}
