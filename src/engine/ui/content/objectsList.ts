import {SceneState, SceneStateType} from "../../state"
import {UIElementType} from "../uiElementType"
import {link} from "../controls"
import {fullSize} from "../elementSizeValue"
import {Object} from "../../objects"
import {ObjectState, ObjectStateType} from "../../state/objectState"
import {CollapsablePanel, Row, Stack, ContentElement, row, stack, collapsablePanel} from "../layout"
import {UIContext} from "../uiContext"
import {Padding} from "../padding"

export function objectsList() {
  return new ObjectsList()
}

export class ObjectsList extends ContentElement {

  private readonly panel: CollapsablePanel
  private readonly objectsList: Stack

  private get sceneState(): SceneState {
    return this.context.state.get(SceneStateType)
  }

  private get objectState(): ObjectState {
    return this.context.state.get(ObjectStateType)
  }

  readonly elementType: UIElementType = UIElementType.ScenesInfo

  constructor() {
    super()

    this.objectsList = stack()
    this.panel = collapsablePanel("Objects", this.objectsList)
    this.content = this.panel
  }

  protected contextAttached(context: UIContext) {
    this.updateScenes()
    this.context.state.subscribeUpdate(SceneStateType, () => this.updateScenes(), this)
  }

  private updateScenes() {
    this.panel.title = "Scene: " + this.sceneState.title
    const state = this.context.state.get(SceneStateType)
    this.objectsList.children = state.objects.map((object: Object) => this.sceneRow(object))
  }

  private sceneRow(object: Object) {
    return row({
      padding: Padding.single(0)
    }, [
      link(object.id, () => this.selectObject(object), {width: fullSize})
    ])
  }

  private selectObject(object: Object) {
    this.objectState.setObject(object)
  }
}
