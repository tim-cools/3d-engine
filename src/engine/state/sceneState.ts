import {RenderStyle} from "./renderStyle"
import {RenderModel} from "./renderModel"
import {State, StateIdentifier} from "./state"
import {SceneName} from "./sceneName"
import {PublishStateEvents} from "./stateManager"

export const SceneStateIdentifier = new StateIdentifier<SceneState>("scene")

export interface SceneState {
  readonly index: number
  readonly name: string
  readonly renderStyle: RenderStyle
  readonly renderStyleCaption: string
  readonly renderModel: RenderModel
  readonly renderModelCaption: string
  readonly axisVisible: boolean
  readonly showBoundaries: boolean

  setScene(scene: SceneName): void
  switchRenderStyle(): void
  switchRenderModel(): void
  toggleAxis(): void
  toggleShowBoundaries(): void
}

export class SceneStateHandler extends State<SceneState> implements SceneState {

  index: number = 0
  name: string = ""
  renderStyle: RenderStyle = RenderStyle.Solid
  renderStyleCaption: string = "Solid"
  renderModel: RenderModel = RenderModel.Result
  renderModelCaption: string = "Result"
  axisVisible: boolean = false
  showBoundaries: boolean = false

  constructor(publishStateEvents: PublishStateEvents) {
    super(SceneStateIdentifier, publishStateEvents)
  }

  setScene(scene: SceneName) {
    this.index = scene.index
    this.name = scene.name
    this.updated()
  }

  switchRenderStyle() {
    const value = (this.renderStyle + 1) % (RenderStyle.WireframeDebug + 1)
    console.log(`switchRenderStyle: ${RenderStyle[value]}`)
    this.renderStyle = value
    this.renderStyleCaption =RenderStyle[value]
    this.updated()
  }

  switchRenderModel() {
    const value = (this.renderModel + 1) % (RenderModel.Second + 1)
    console.log(`switchRenderModel: ${RenderModel[value]}`)
    this.renderModel = value
    this.renderModelCaption = RenderModel[value]
    this.updated()
  }

  toggleAxis() {
    this.axisVisible = !this.axisVisible
    this.updated()
  }

  toggleShowBoundaries() {
    this.showBoundaries = !this.showBoundaries
    this.updated()
  }
}
