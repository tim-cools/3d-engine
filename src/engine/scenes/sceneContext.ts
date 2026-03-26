import {EventDispatcher, GlobalEventDispatcher} from "../events"
import {SelectionStateHandler} from "../state/selectionState"
import {AlgorithmStateHandler} from "../state/algorithmState"
import {ApplicationContext} from "../applicationContext"
import {State, StateIdentifier} from "../state/state"
import {SceneStateHandler} from "../state/sceneState"
import {ScenesStateHandler} from "../state/scenesState"
import {Scene} from "./scene"

export class SceneContext implements ApplicationContext {

  private globalContext: Context

  readonly events: EventDispatcher

  constructor(events: EventDispatcher, globalContext: Context) {
    this.events = events
    this.globalContext = globalContext
  }

  state<TState>(definition: StateIdentifier<TState>): TState {
    return this.globalContext.state(definition)
  }
}

export class Context implements ApplicationContext {

  private currenScene: SceneContext
  private states = new Map<string, any>()

  readonly events: GlobalEventDispatcher

  constructor(scenes: readonly Scene[]) {
    this.events = new GlobalEventDispatcher()
    this.currenScene = new SceneContext(this.events, this)
    this.addStateHandler(new SceneStateHandler())
    this.addStateHandler(new SelectionStateHandler())
    this.addStateHandler(new AlgorithmStateHandler())
    this.addStateHandler(new ScenesStateHandler(scenes))
  }

  state<TState>(definition: StateIdentifier<TState>): TState {
    const entry = this.states.get(definition.type)
    if (entry == undefined) {
      throw new Error("Invalid state: " + definition.type)
    }
    return entry as TState
  }

  newScene(): ApplicationContext {
    this.currenScene = new SceneContext(this.events.newScene(), this)
    return this.currenScene
  }

  private addStateHandler<TState>(state: State<TState>) {
    this.states.set(state.identifier.type, state)
  }
}
