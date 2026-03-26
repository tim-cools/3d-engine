import {ElementSizeValue} from "../elementSizeValue"
import {Row, Stack} from "../controls"
import {Link} from "../controls/link"
import {SceneState, SceneStateIdentifier} from "../../state/sceneState"
import {ScenesState} from "../../state/scenes"
import {SceneName} from "../../state/sceneName"
import {ApplicationContext} from "../../applicationContext"
import {State} from "../../state/state"
import {UIElementType} from "../uiElementType"

export class ScenesInfo extends Stack {

  private sceneState: State<SceneState>

  readonly elementType: UIElementType = UIElementType.ScenesInfo

  constructor(context: ApplicationContext) {
    super(context, "ScenesInfo", [])
    this.sceneState = this.context.state(SceneStateIdentifier)
    this.updateScenes()
  }

  private updateScenes() {
    const context = this.context.state(ScenesState).current
    const rows = context.scenes.map((scene, index) => this.row(index, scene))
    this.setChildren(rows)
  }

  private row(index: number, scene: SceneName) {
    return new Row(this.context, index.toString(), [
      new Link(this.context, "link", ElementSizeValue.full, scene.name, () => this.selectScene(scene))
    ])
  }

  private selectScene(scene: SceneName) {
    this.sceneState.current.setScene(scene)
  }
}
