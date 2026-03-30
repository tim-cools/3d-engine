import {UIElementType} from "../uiElementType"
import {Row, Stack, Panel, ContentElement} from "../layout"
import {Text} from "../controls"
import {UIContext} from "../uiContext"

export class WorldDetails extends ContentElement {
  private readonly properties: Stack
  private readonly panel: Panel

  readonly elementType: UIElementType = UIElementType.SceneInfo

  constructor() {
    super()

    this.properties = new Stack({children: [
      new Text({text: "todo"})
    ]})
    this.panel = new Panel({title: "World", content: this.properties})
    this.content = this.panel
  }

  protected contextAttached(context: UIContext) {
  }

}
