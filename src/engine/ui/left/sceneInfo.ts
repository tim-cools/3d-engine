import {SceneContext} from "../../scenes/sceneContext"
import {ElementSizeValue} from "../elementSizeValue"
import {Row, Stack, Text} from "../controls"
import {ContentElement} from "../layout/contentElement"

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
        SceneInfo.row(context, "Render styles: ", this.textRenderStyle),
        SceneInfo.row(context, "Render model: ", this.textRenderModel),
        SceneInfo.row(context, "Algorithm: ", this.textAlgorithm)
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
    return new Text(context, new ElementSizeValue(100, true), caption)
  }

  private static row(context: SceneContext, title: string, caption: Text) {
    return new Row(context, [
      new Text(context, new ElementSizeValue(150), title),
      caption
    ])
  }
}
