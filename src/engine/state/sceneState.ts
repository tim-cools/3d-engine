import {RenderStyle} from "./renderStyle"
import {RenderModel} from "./renderModel"
import {StateIdentifier} from "./state"
import {StateHandlerBase} from "./stateHandler"
import {SceneName} from "./sceneName"

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

export class SceneStateHandler extends StateHandlerBase<SceneState> {

  constructor() {
    super(SceneStateIdentifier)
  }

  setScene(scene: SceneName) {
    this.state.update(state => {
      console.log(`setScene: ${scene.index} - ${scene.name}`)
      return {
        ...state,
        index: scene.index,
        name: scene.name,
      }
    })
  }

  switchRenderStyle() {
    this.state.update(state => {
      const value = (state.renderStyle + 1) % (RenderStyle.WireframeDebug + 1)
      console.log(`switchRenderStyle: ${RenderStyle[value]}`)
      return {
        ...state,
        renderStyle: value,
        renderStyleCaption: RenderStyle[value]
      }
    })
  }

  switchRenderModel() {
    this.state.update(state => {
      const value = (state.renderModel + 1) % (RenderModel.Second + 1)
      console.log(`switchRenderModel: ${RenderModel[value]}`)
      return {
        ...state,
        renderModel: value,
        renderModelCaption: RenderModel[value]
      }
    })
  }

  toggleAxis() {
    this.state.update(state => {
      return {
        ...state,
        axisVisible: !state.axisVisible
      }
    })
  }

  toggleShowBoundaries() {
    this.state.update(state => {
      return {
        ...state,
        showBoundaries: !state.showBoundaries
      }
    })
  }

  protected createState(): SceneState {
    return {
      index: 0,
      name: "",
      renderStyle: RenderStyle.Solid,
      renderStyleCaption: "Solid",
      renderModel: RenderModel.Result,
      renderModelCaption: "Result",
      axisVisible: false,
      showBoundaries: false,

      setScene: (scene: SceneName) => this.setScene(scene),
      switchRenderStyle: () => this.switchRenderStyle(),
      switchRenderModel: () => this.switchRenderModel(),
      toggleAxis: () => this.toggleAxis(),
      toggleShowBoundaries: () => this.toggleShowBoundaries(),
    }
  }
}
