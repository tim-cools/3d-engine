import {ElementSizeValue} from "../elementSizeValue"
import {Row, Stack} from "../controls"
import {Link} from "../controls/link"
import {SceneName, SceneState, SceneStateType, ScenesStateType} from "../../state"
import {ApplicationContext} from "../../applicationContext"
import {UIElementType} from "../uiElementType"
import {ContentElement} from "../layout/contentElement"
import {Panel} from "../layout/panel"

export class ScenesList extends ContentElement {

  private sceneState: SceneState
  private stack: Stack

  readonly elementType: UIElementType = UIElementType.ScenesInfo

  constructor(context: ApplicationContext) {
    super(context, "scenes")
    this.sceneState = this.context.state.get(SceneStateType)
    this.stack = new Stack(context, "scenesList", [])
    this.content = new Panel(context, "scenes", "Scenes", this.stack)
    this.updateScenes()
  }

  private updateScenes() {
    const state = this.context.state.get(ScenesStateType)
    this.stack.children = state.scenes.map((scene: SceneName, index: number) => this.row(index, scene))
  }

  private row(index: number, scene: SceneName) {
    return new Row(this.context, index.toString(), [
      new Link(this.context, "link", ElementSizeValue.full, scene.name, () => this.selectScene(scene))
    ])
  }

  private selectScene(scene: SceneName) {
    this.sceneState.setScene(scene.index)
  }
}
