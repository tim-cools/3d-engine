import {Text} from "../controls"
import {UIElementType} from "../uiElementType"
import {Row, Stack, Panel, ContentElement} from "../layout"
import {UIContext} from "../uiContext"

export class SelectedList extends ContentElement {

  private readonly stack: Stack

  readonly elementType: UIElementType = UIElementType.ScenesInfo

  constructor() {
    super()
    this.stack = new Stack({
      children: [
        new Text({text: "todo"})
      ]
    })
    this.content = new Panel({title: "Selected Faces", content: this.stack})
  }

  protected contextAttached(context: UIContext) {
  }
}
