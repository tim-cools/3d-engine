import {Canvas, collapsablePanel, ContentElement, sidePanel, stack} from "../layout"
import {text} from "../controls"
import {SidePanelLocation} from "../layout"
import {UIElementType} from "../uiElementType"
import {selection} from "./selection"
import {worldDetails} from "./worldDetails"

export function sidePanelRight() {
  return new SidePanelRight()
}

export class SidePanelRight extends ContentElement {

  readonly elementType: UIElementType = UIElementType.SidePanelRight

  constructor() {
    super({attach: [Canvas.right(0)]})

    this.content = sidePanel(SidePanelLocation.Right, "Right", [
      collapsablePanel("Instructions", SidePanelRight.instructionsInfo()),
      //worldDetails(),
      selection(),
    ])
  }

  private static instructionsInfo() {
    return stack({}, [
      text("Fun with 3D graphics and typescript."),
      text("  Mouse: rotate world (+shift)"),
      text("  Keys arrows: move world (+shift))"),
      text("  Select objects to change render settings"),
    ])
  }
}













