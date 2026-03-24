import {PanelHeader} from "./panelHeader"
import {PanelContent} from "./panelContent"
import {SceneContext} from "../../scenes/sceneContext"
import {UIElement} from "../uiElement"
import {Stack} from "../controls"
import {ContentElement} from "./contentElement"

export class Panel extends ContentElement {

  private readonly header: PanelHeader

  get title(): string {
    return this.header.title
  }

  set title(value: string) {
    this.header.title = value
  }

  constructor(context: SceneContext, title: string, content: UIElement) {
    super(context)
    this.header = new PanelHeader(context, title)
    this.setContent(
      new Stack(context, [
        this.header,
        new PanelContent(context, content)
      ], 0)
    )
  }
}

