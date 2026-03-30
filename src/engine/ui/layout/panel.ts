import {PanelContent} from "./panelContent"
import {UIElement, UIElementProperties} from "../uiElement"
import {Text, Box, IconButton} from "../controls"
import {Row, Stack} from "../layout"
import {ContentElement} from "./contentElement"
import {UIElementType} from "../uiElementType"
import {Colors} from "../../../infrastructure/colors"
import {ElementSizeValue} from "../elementSizeValue"
import {Icon} from "../rendering/icons"
import {ElementSize} from "../elementSize"
import {Padding} from "../padding"

export interface PanelProperties extends UIElementProperties {
  title?: string
  content: UIElement
}

export class Panel extends ContentElement {

  private readonly headerText: Text
  private readonly expandButton: IconButton
  private readonly panel: PanelContent

  private open: boolean = true

  readonly elementType: UIElementType = UIElementType.Panel

  get title(): string {
    return this.headerText.value
  }

  set title(value: string) {
    this.headerText.value = value
  }

  constructor(properties: PanelProperties) {
    super(properties)
    this.headerText = new Text({width: new ElementSizeValue(100, true), text: properties.title ?? "Title"})
    this.expandButton = new IconButton({size: new ElementSizeValue(18), icon: Icon.ArrowUp, onClick: () => this.toggleExpand()})
    this.panel = new PanelContent({content: properties.content})
    this.content =
      new Stack({spacing: 0, children: [
        new Box({
          backgroundColor: Colors.ui.titleBackground,
          size: new ElementSize(ElementSizeValue.full, new ElementSizeValue(28)),
          padding: new Padding(6, 6, 12, 6),
          content: new Row({
            spacing: 0,
            children: [
              this.headerText,
              this.expandButton
            ]
          })
        }),
        this.panel
      ]})
  }

  private toggleExpand() {
    this.open = !this.open
    this.expandButton.icon = this.open ? Icon.ArrowUp : Icon.ArrowDown
    this.panel.visible = this.open
  }
}
