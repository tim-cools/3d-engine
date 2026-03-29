import {ElementSizeValue} from "../elementSizeValue"
import {Row, Stack} from "../controls"
import {Link} from "../controls/link"
import {SceneName, SceneStateType, ScenesStateType} from "../../state"
import {UIElementType} from "../uiElementType"
import {ContentElement} from "../layout/contentElement"
import {Panel} from "../layout/panel"
import {UIContext} from "../uiContext"
import {Assert} from "../../../infrastructure"

export class ScenesList extends ContentElement {

  private stack: Stack

  readonly elementType: UIElementType = UIElementType.ScenesInfo

  constructor() {
    super()
    this.stack = new Stack()
    this.content = new Panel({id: "Scenes", content: this.stack})
  }

  protected contextAttached(context: UIContext) {
    this.updateScenes(context)
  }

  private updateScenes(context: UIContext) {
    const state = context.state.get(ScenesStateType)
    this.stack.children = state.scenes.map((scene: SceneName) => this.row(scene))
  }

  private row(scene: SceneName) {
    return new Row({
      children: [
        new Link({width: ElementSizeValue.full, title: scene.name, onClick: () => this.selectScene(scene)})
      ]}
    )
  }

  private selectScene(scene: SceneName) {
    const sceneState = Assert.notNull(this.context, "context").state.get(SceneStateType)
    sceneState.setScene(scene.index)
  }
}
