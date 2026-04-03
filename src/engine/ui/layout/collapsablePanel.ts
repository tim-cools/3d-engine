import {contentPanel, ContentPanel} from "./contentPanel"
import {UIElement, UIElementProperties} from "../uiElement"
import {Text, Box, IconButton, text, iconButton, box} from "../controls"
import {row, Row, stack, Stack} from "../layout"
import {ContentElement} from "./contentElement"
import {UIElementType} from "../uiElementType"
import {Colors} from "../../../infrastructure/colors"
import {fullSize} from "../elementSizeValue"
import {Icon} from "../rendering/icons"
import {ElementSize} from "../elementSize"
import {Padding} from "../padding"

export function collapsablePanel(title: string, content: UIElement, properties: PanelProperties | undefined = undefined) {
  return new CollapsablePanel({
    ...properties,
    title: title,
    content: content
  })
}

export interface PanelProperties extends UIElementProperties {
  title?: string
  content?: UIElement
}

export class CollapsablePanel extends ContentElement {

  private readonly headerText: Text
  private readonly expandButton: IconButton
  private readonly panel: ContentPanel

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

    this.headerText = text(properties.title ?? "Title", {width: fullSize})
    this.expandButton = iconButton(Icon.ArrowUp, {size: 18, onClick: () => this.toggleExpand()})
    this.panel = contentPanel(properties.content)
    this.createContent()
  }

  private createContent() {
    this.content = stack({spacing: 0}, [
      box({
          id: "Header",
          backgroundColor: Colors.ui.titleBackground,
          size: new ElementSize(fullSize, 28),
          padding: new Padding(6, 6, 12, 6)
        },
        row({
          padding: 0,
          spacing: 0
        }, [
          this.headerText,
          this.expandButton
        ])),
      this.panel
    ])
  }

  private toggleExpand() {
    this.open = !this.open
    this.expandButton.icon = this.open ? Icon.ArrowUp : Icon.ArrowDown
    this.panel.visible = this.open
  }
}
