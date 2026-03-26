import {PanelHeader} from "./panelHeader"
import {PanelContent} from "./panelContent"
import {ApplicationContext} from "../../applicationContext"
import {UIElement} from "../uiElement"
import {Stack} from "../controls"
import {ContentElement} from "./contentElement"
import {UIElementType} from "../uiElementType"
import {Identifier} from "../../../infrastructure/nothing"

export class Panel extends ContentElement {

  private readonly header: PanelHeader

  readonly elementType: UIElementType = UIElementType.Panel

  get title(): string {
    return this.header.title
  }

  set title(value: string) {
    this.header.title = value
  }

  constructor(context: ApplicationContext, id: Identifier, title: string, content: UIElement) {
    super(context, id)
    this.header = new PanelHeader(context, title)
    this.setContent(
      new Stack(context, "stack", [
        this.header,
        new PanelContent(context, content)
      ], 0)
    )
  }
}

