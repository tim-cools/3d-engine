import {Panel, ContentElement} from "../layout"
import {Box, Text} from "../controls"
import {ElementSizeValue} from "../elementSizeValue"
import {Stack, SidePanel, SidePanelLocation} from "../layout"
import {UIElementType} from "../uiElementType"
import {WorldDetails} from "./worldDetails"
import {SelectedList} from "./selectedList"

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
          }),
          new WorldDetails(),
          new SelectedList(),
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
