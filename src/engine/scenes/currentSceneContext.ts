import {EventDispatcher} from "../events/eventDispatcher"
import {SceneContext} from "./sceneContext"
import {GlobalEventDispatcher} from "../events/globalEventDispatcher"
import {State} from "../state/state"
import {SceneState} from "../state/sceneState"
import {SelectionState} from "../state/selectionState"
import {AlgorithmState} from "../state/algorithmState"
import {RenderStyle} from "../state/renderStyle"
import {RenderModel} from "../state/renderModel"
import {Algorithm} from "../state/algorithm"
import {SceneName, ScenesState} from "../state/scenesState"
import {Scene} from "./scenes"

export class CurrentSceneContext implements SceneContext {

  private globalContext: GlobalContext

  readonly events: EventDispatcher

  get scene(): State<SceneState> {
    return this.globalContext.scene
  }

  get scenes(): State<ScenesState> {
    return this.globalContext.scenes
  }

  get selection(): State<SelectionState> {
    return this.globalContext.selection
  }

  get algorithm(): State<AlgorithmState> {
    return this.globalContext.algorithm
  }

  constructor(events: EventDispatcher, globalContext: GlobalContext) {
    this.events = events
    this.globalContext = globalContext
  }
}

export class GlobalContext implements SceneContext {

  private sceneContext: CurrentSceneContext

  readonly events: GlobalEventDispatcher
  readonly scene: State<SceneState>
  readonly scenes: State<ScenesState>
  readonly selection: State<SelectionState>
  readonly algorithm: State<AlgorithmState>

  constructor(scenes: readonly Scene[]) {
    this.events = new GlobalEventDispatcher()
    this.sceneContext = new CurrentSceneContext(this.events, this)
    this.scene = new State<SceneState>({
      name: "",
      renderStyle: RenderStyle.Solid,
      renderStyleCaption: "Solid",
      renderModel: RenderModel.Result,
      renderModelCaption: "Result",
      axisVisible: false,
      showBoundaries: false
    })
    this.selection = new State<SelectionState>({
      faceIds: []
    })
    this.algorithm = new State<AlgorithmState>({
      value: Algorithm.SubtractFaces,
      caption: "SubtractFaces"
    })
    this.scenes = new State<ScenesState>({
      scenes: this.createScenes(scenes)
    })
  }

  setScene(): SceneContext {
    this.sceneContext = new CurrentSceneContext(this.events.newScene(), this)
    return this.sceneContext
  }

  private createScenes(scenes: readonly Scene[]) {
    const result: SceneName[] = []
    for (let index = 0; index < scenes.length; index++){
      const scene = scenes[index]
      result.push(new SceneName(index, scene.title))
    }
    return result
  }
}
