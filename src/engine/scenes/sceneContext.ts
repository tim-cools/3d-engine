import {EventDispatcher} from "../events/eventDispatcher"
import {GlobalEventDispatcher} from "../events/globalEventDispatcher"
import {SelectionStateHandler} from "../state/selectionState"
import {AlgorithmStateHandler} from "../state/algorithmState"
import {StateHandler} from "../state/stateHandler"
import {ApplicationContext} from "../applicationContext"
import {State, StateIdentifier} from "../state/state"
import {SceneStateHandler} from "../state/sceneState"
import {ScenesStateHandler} from "../state/scenes"
import {Scene} from "./scene"

export class SceneContext implements ApplicationContext {

  private globalContext: Context

  readonly events: EventDispatcher

  constructor(events: EventDispatcher, globalContext: Context) {
    this.events = events
    this.globalContext = globalContext
  }

  state<TState>(definition: StateIdentifier<TState>): State<TState> {
    return this.globalContext.state(definition)
  }
}

export class Context implements ApplicationContext {

  private currenScene: SceneContext
  private states = new Map<string, {handler: any, state: any}>()

  readonly events: GlobalEventDispatcher

  constructor(scenes: readonly Scene[]) {
    this.events = new GlobalEventDispatcher()
    this.currenScene = new SceneContext(this.events, this)
    this.addStateHandler(new SceneStateHandler())
    this.addStateHandler(new SelectionStateHandler())
    this.addStateHandler(new AlgorithmStateHandler())
    this.addStateHandler(new ScenesStateHandler(scenes))
  }

  state<TState>(definition: StateIdentifier<TState>): State<TState> {
    const entry = this.states.get(definition.type)
    if (entry == undefined) {
      throw new Error("Invalid state: " + definition.type)
    }
    return entry.state as State<TState>
  }

  newScene(): ApplicationContext {
    this.currenScene = new SceneContext(this.events.newScene(), this)
    return this.currenScene
  }

  private addStateHandler<TState>(handler: StateHandler<TState>) {
    this.states.set(handler.identifier.type, {handler: handler, state: handler.state})
  }
}
