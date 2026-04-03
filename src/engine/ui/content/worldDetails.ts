import {UIElementType} from "../uiElementType"
import {Stack, CollapsablePanel, ContentElement, stack, collapsablePanel} from "../layout"
import {text} from "../controls"

export function worldDetails() {
  return new WorldDetails()
}

export class WorldDetails extends ContentElement {
  private readonly properties: Stack
  private readonly panel: CollapsablePanel

  readonly elementType: UIElementType = UIElementType.SceneInfo

  constructor() {
    super()

    this.properties = stack({}, [text("todo")])
    this.panel = collapsablePanel("World", this.properties)
    this.content = this.panel
  }
}
