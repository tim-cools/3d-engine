import {SceneState, SceneStateType} from "../../state"
import {UIElementType} from "../uiElementType"
import {Link} from "../controls"
import {ElementSizeValue} from "../elementSizeValue"
import {Object} from "../../objects"
import {ObjectState, ObjectStateType} from "../../state/objectState"
import {Panel, Row, Stack, ContentElement} from "../layout"
import {UIContext} from "../uiContext"

export class ObjectsList extends ContentElement {

  private readonly panel: Panel
  private readonly stack: Stack

  private get sceneState(): SceneState {
    return this.context.state.get(SceneStateType)
  }

  private get objectState(): ObjectState {
    return this.context.state.get(ObjectStateType)
  }

  readonly elementType: UIElementType = UIElementType.ScenesInfo

  constructor() {
    super()

    this.stack = new Stack()
    this.panel = new Panel({title: "Objects", content: this.stack})
    this.content = this.panel
  }

  protected contextAttached(context: UIContext) {
    this.updateScenes()
    this.context.state.subscribeUpdate(SceneStateType, () => this.updateScenes(), this)
  }

  private updateScenes() {
    this.panel.title = "Scene: " + this.sceneState.title
    const state = this.context.state.get(SceneStateType)
    this.stack.children = state.objects.map((object: Object) => this.row(object))
  }

  private row(object: Object) {
    return new Row({
      children: [
        new Link({width: ElementSizeValue.full, title: object.id, onClick: () => this.selectObject(object)})
      ]
    })
  }

  private selectObject(object: Object) {
    this.objectState.setObject(object)
  }
}
