import {SceneContext} from "../../scenes/sceneContext"
import {ElementSizeValue} from "../elementSizeValue"
import {Row, Stack, Text} from "../controls"
import {ContentElement} from "../layout/contentElement"
import {Link} from "../controls/link"
import {SwitchAlgorithm, SwitchRenderModel, SwitchRenderStyle} from "../../events/update"

export class SceneInfo extends ContentElement {

  private readonly textRenderStyle: Text
  private readonly textRenderModel: Text
  private readonly textAlgorithm: Text

  constructor(context: SceneContext) {
    super(context)

    this.textRenderStyle = SceneInfo.caption(context, context.scene.value.renderStyleCaption)
    this.textRenderModel = SceneInfo.caption(context, context.scene.value.renderModelCaption)
    this.textAlgorithm = SceneInfo.caption(context, context.algorithm.value.caption)

    this.setContent(
      new Stack(context, [
        SceneInfo.row(context, "Render styles", this.textRenderStyle, () => this.switchRenderStyle()),
        SceneInfo.row(context, "Model (todo)", this.textRenderModel, () => this.switchRenderModel()),
        SceneInfo.row(context, "Algorithm", this.textAlgorithm, () => this.switchAlgorithm()),
      ])
    )

    context.scene.onUpdate(state => {
      this.textRenderStyle.title = state.renderStyleCaption
      this.textRenderModel.title = state.renderModelCaption
    })

    context.algorithm.onUpdate(state => {
      this.textAlgorithm.title = state.caption
    })
  }

  private static caption(context: SceneContext, caption: string) {
    return new Text(context, new ElementSizeValue(135), caption)
  }

  private static row(context: SceneContext, title: string, caption: Text, onClick: (() => void)) {
    return new Row(context, [
      new Text(context, new ElementSizeValue(120), title),
      caption,
      new Link(context, new ElementSizeValue(75), "🔁", onClick)
    ])
  }

  private switchAlgorithm() {
    this.context.events.publish(SwitchAlgorithm, new SwitchAlgorithm())
  }

  private switchRenderModel() {
    this.context.events.publish(SwitchRenderModel, new SwitchRenderModel())
  }

  private switchRenderStyle() {
    this.context.events.publish(SwitchRenderStyle, new SwitchRenderStyle())
  }
}
