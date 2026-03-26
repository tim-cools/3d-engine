import {ElementSizeValue} from "../elementSizeValue"
import {Row, Stack} from "../controls"
import {Link} from "../controls/link"
import {SceneName, SceneState, SceneStateIdentifier, ScenesStateIdentifier} from "../../state"
import {ApplicationContext} from "../../applicationContext"
import {UIElementType} from "../uiElementType"

export class ScenesInfo extends Stack {

  private sceneState: SceneState

  readonly elementType: UIElementType = UIElementType.ScenesInfo

  constructor(context: ApplicationContext) {
    super(context, "ScenesInfo", [])
    this.sceneState = this.context.state.get(SceneStateIdentifier)
    this.updateScenes()
  }

  private updateScenes() {
    const state = this.context.state.get(ScenesStateIdentifier)
    const rows = state.scenes.map((scene: SceneName, index: number) => this.row(index, scene))
    this.setChildren(rows)
  }

  private row(index: number, scene: SceneName) {
    return new Row(this.context, index.toString(), [
      new Link(this.context, "link", ElementSizeValue.full, scene.name, () => this.selectScene(scene))
    ])
  }

  private selectScene(scene: SceneName) {
    this.sceneState.setScene(scene)
  }
}
