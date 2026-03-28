import {ApplicationContext} from "../../applicationContext"
import {Row, Stack} from "../controls"
import {SceneState, SceneStateType} from "../../state"
import {UIElementType} from "../uiElementType"
import {Link} from "../controls/link"
import {ElementSizeValue} from "../elementSizeValue"
import {Object} from "../../objects"
import {ObjectState, ObjectStateType} from "../../state/objectState"
import {ContentElement} from "../layout/contentElement"
import {Panel} from "../layout/panel"

export class ObjectsList extends ContentElement {

  private readonly sceneState: SceneState
  private readonly objectState: ObjectState
  private readonly panel: Panel
  private readonly stack: Stack

  readonly elementType: UIElementType = UIElementType.ScenesInfo

  constructor(context: ApplicationContext) {
    super(context, "ObjectsList")

    this.sceneState = this.context.state.get(SceneStateType)
    this.objectState = this.context.state.get(ObjectStateType)

    this.stack = new Stack(context, "stack", [])
    this.panel = new Panel(context, "object", "Objects", this.stack)
    this.content = this.panel
    this.updateScenes()

    this.context.state.subscribeUpdate(SceneStateType, () => this.updateScenes(), this)
  }

  private updateScenes() {
    this.panel.title = "Scene: " + this.sceneState.title
    const state = this.context.state.get(SceneStateType)
    const rows = state.objects.map((object: Object, index: number) => this.row(index, object))
    this.stack.children = rows
  }

  private row(index: number, object: Object) {
    return new Row(this.context, index.toString(), [
      new Link(this.context, "link." + object.id, ElementSizeValue.full, object.id, () => this.selectObject(object))
    ])
  }

  private selectObject(object: Object) {
    this.objectState.setObject(object)
  }
}
