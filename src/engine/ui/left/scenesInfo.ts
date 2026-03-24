import {SceneContext} from "../../scenes/sceneContext"
import {ElementSizeValue} from "../elementSizeValue"
import {Row, Stack, Text} from "../controls"
import {SceneName, ScenesState} from "../../state/scenesState"
import {Link} from "../controls/link"
import {SelectScene} from "../../events/update"

export class ScenesInfo extends Stack {

  constructor(context: SceneContext) {
    super(context, [])

    const scenesState = this.context.scenes.value

    this.updateScenes(scenesState)
  }

  private updateScenes(scenesState: ScenesState) {
    this.setChildren(scenesState.scenes.map(scene => this.row(scene)))
  }

  private row(scene: SceneName) {
    return new Row(this.context, [
      new Link(this.context, ElementSizeValue.full, scene.name, () => this.context.events.publish(SelectScene, new SelectScene(scene.index)))
    ])
  }
}
