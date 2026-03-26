import {PanelContent} from "./panelContent"
import {ApplicationContext} from "../../applicationContext"
import {UIElement} from "../uiElement"
import {Row, Stack, Text} from "../controls"
import {ContentElement} from "./contentElement"
import {UIElementType} from "../uiElementType"
import {Identifier} from "../../../infrastructure/nothing"
import {Colors} from "../../../infrastructure/colors"
import {ElementSizeValue} from "../elementSizeValue"
import {IconButton} from "../controls/iconButton"
import {Icon} from "../rendering/icons"
import {Box} from "../controls/box"
import {ElementSize} from "../elementSize"
import {Padding} from "../padding"

export class Panel extends ContentElement {

  private readonly headerText: Text
  private readonly expandButton: IconButton
  private readonly panel: PanelContent

  private expand: boolean = true

  readonly elementType: UIElementType = UIElementType.Panel

  get title(): string {
    return this.headerText.value
  }

  set title(value: string) {
    this.headerText.value = value
  }

  constructor(context: ApplicationContext, id: Identifier, title: string, content: UIElement) {
    super(context, id)
    this.headerText = new Text(context, "text", new ElementSizeValue(100, true), title)
    this.expandButton = new IconButton(context, "expand", new ElementSizeValue(18), Icon.ArrowUp, () => this.toggleExpand())
    this.panel = new PanelContent(context, content)
    this.setContent(
      new Stack(context, "stack", [
        new Box(context, "header", Colors.ui.titleBackground,
          new ElementSize(new ElementSizeValue(100, true), new ElementSizeValue(28)),
          new Row(context, "row", [
            this.headerText,
            this.expandButton
          ], 0),
          new Padding(6, 6, 12, 6)
      ),
        this.panel
      ], 0)
    )
  }

  private toggleExpand() {
    this.expand = !this.expand
    this.expandButton.icon = this.expand ? Icon.ArrowUp : Icon.ArrowDown
    this.panel.visible = this.expand
  }
}

