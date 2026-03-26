import {ElementSizeValue} from "../elementSizeValue"
import {Row, Stack, Text} from "../controls"
import {ContentElement} from "../layout/contentElement"
import {Link} from "../controls/link"
import {SceneStateIdentifier, SceneState} from "../../state/sceneState"
import {AlgorithmStateIdentifier, AlgorithmState} from "../../state/algorithmState"
import {ApplicationContext} from "../../applicationContext"
import {UIElementType} from "../uiElementType"

export class SceneInfo extends ContentElement {

  private readonly textRenderStyle: Text
  private readonly textRenderModel: Text
  private readonly textAlgorithm: Text
  private readonly scene: SceneState
  private readonly algorithm: AlgorithmState

  readonly elementType: UIElementType = UIElementType.SceneInfo

  constructor(context: ApplicationContext) {
    super(context, "sceneInfo")

    this.scene = context.state(SceneStateIdentifier)
    this.algorithm = context.state(AlgorithmStateIdentifier)

    this.textRenderStyle = SceneInfo.value(context, this.scene.renderStyleCaption)
    this.textRenderModel = SceneInfo.value(context, this.scene.renderModelCaption)
    this.textAlgorithm = SceneInfo.value(context, this.algorithm.caption)

    this.setContent(this.createContext(context))

    this.scene.onUpdate(state => this.setRenderState(state))
    this.algorithm.onUpdate(state => this.setAlgorithm(state))
  }

  private createContext(context: ApplicationContext) {
    return new Stack(context, "stack", [
      SceneInfo.row(context, "renderStyle", "Render styles", this.textRenderStyle, () => this.switchRenderStyle()),
      SceneInfo.row(context, "renderModel", "Model (todo)", this.textRenderModel, () => this.switchRenderModel()),
      SceneInfo.row(context, "algorithm", "Algorithm", this.textAlgorithm, () => this.switchAlgorithm()),
    ])
  }

  private setRenderState(state: SceneState) {
    this.textRenderStyle.value = state.renderStyleCaption
    this.textRenderModel.value = state.renderModelCaption
  }

  private setAlgorithm(state: AlgorithmState) {
    this.textAlgorithm.value = state.caption
  }

  private switchAlgorithm() {
    this.algorithm.switchAlgorithm()
  }

  private switchRenderModel() {
    this.scene.switchRenderModel()
  }

  private switchRenderStyle() {
    this.scene.switchRenderStyle()
  }

  private static value(context: ApplicationContext, caption: string) {
    return new Text(context, "value", new ElementSizeValue(135), caption)
  }

  private static row(context: ApplicationContext, id: string, title: string, caption: Text, onClick: (() => void)) {
    return new Row(context, id, [
      new Text(context, "title", new ElementSizeValue(120), title),
      caption,
      new Link(context, "refresh", new ElementSizeValue(75), "🔁", onClick)
    ])
  }
}
