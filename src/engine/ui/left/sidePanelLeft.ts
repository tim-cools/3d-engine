import {SidePanel} from "./sidePanel"
import {SceneContext} from "../../scenes/sceneContext"
import {ContentElement} from "../layout/contentElement"
import {SidePanelLocation} from "./sidePanelLocation"
import {Stack, Text} from "../controls"
import {ElementSizeValue} from "../elementSizeValue"

export class SidePanelLeft extends ContentElement {
  constructor(context: SceneContext) {
    super(context)
    this.setContent(
      new SidePanel(context, SidePanelLocation.Left, [
        new Stack(context, [
          new Text(context, ElementSizeValue.full, "TEST 123"),
          new Text(context, ElementSizeValue.full, "TEST 456"),
          new Text(context, ElementSizeValue.full, "TEST 789"),
          new Text(context, ElementSizeValue.full, "TEST 789"),
          new Text(context, ElementSizeValue.full, "TEST 789"),
          new Text(context, ElementSizeValue.full, "TEST 789"),
          new Text(context, ElementSizeValue.full, "TEST 789"),
          new Text(context, ElementSizeValue.full, "TEST 789"),
          new Text(context, ElementSizeValue.full, "TEST 789"),
        ])
      ])
    )
  }
}
