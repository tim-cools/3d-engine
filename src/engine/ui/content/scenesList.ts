import {fullSize} from "../elementSizeValue"
import {link} from "../controls"
import {SceneName, SceneStateType, ScenesStateType} from "../../state"
import {UIElementType} from "../uiElementType"
import {Row, Stack, CollapsablePanel, ContentElement, stack, row} from "../layout"
import {UIContext} from "../uiContext"
import {Assert} from "../../../infrastructure"
import {Padding} from "../padding"

export function scenesList() {
  return new ScenesList()
}

export class ScenesList extends ContentElement {

  private list: Stack

  readonly elementType: UIElementType = UIElementType.ScenesInfo

  constructor() {
    super()
    this.list = stack({id: "ScenesList"})
    this.content = new CollapsablePanel({id: "Scenes", title: "Scenes", content: this.list})
  }

  protected contextAttached(context: UIContext) {
    this.updateScenes(context)
  }

  private updateScenes(context: UIContext) {
    const state = context.state.get(ScenesStateType)
    this.list.children = state.scenes.map((scene: SceneName) => this.sceneRow(scene))
  }

  private sceneRow(scene: SceneName) {
    return row({
      padding: Padding.single(0)
    },  [
      link(scene.name, () => this.selectScene(scene), {width: fullSize})
    ])
  }

  private selectScene(scene: SceneName) {
    const sceneState = Assert.notNull(this.context, "context").state.get(SceneStateType)
    sceneState.setScene(scene.index)
  }
}
