import {State, StateIdentifier} from "./state"
import {SceneStateHandler} from "./sceneState"
import {SelectionStateHandler} from "./selectionState"
import {AlgorithmStateHandler} from "./algorithmState"
import {ScenesStateHandler} from "./scenesState"
import {Scene} from "../scenes"

export interface PublishStateEvents {
  updated<TState>(definition: StateIdentifier<TState>): void
}

export interface StateManager {
  get<TState>(definition: StateIdentifier<TState>): TState
  subscribeUpdate<TState>(definition: StateIdentifier<TState>, update: (state: TState) => void): void
}

export class SceneStateManager implements StateManager {

  private updateSubscribers = new Map<string, ((state: any) => void)[]>()

  constructor(private applicationStateManager: ApplicationStateManager) {
  }

  get<TState>(definition: StateIdentifier<TState>): TState {
    return this.applicationStateManager.get(definition)
  }

  subscribeUpdate<TState>(definition: StateIdentifier<TState>, update: (state: TState) => void): void {
    const subscribers = this.updateSubscribers.get(definition.type);
    if (subscribers == undefined) {
      this.updateSubscribers.set(definition.type, [update]);
    } else {
      subscribers.push(update)
    }
  }

  updated<TState>(definition: StateIdentifier<TState>): void {
    const subscribers = this.updateSubscribers.get(definition.type);
    if (subscribers == undefined) return
    const state = this.get(definition)
    for (const handler of subscribers) {
      handler(state as any as TState)
    }
  }
}

export class ApplicationStateManager implements StateManager, PublishStateEvents {

  private currentScene: SceneStateManager = new SceneStateManager(this)
  private states = new Map<string, any>()
  private updateSubscribers = new Map<string, ((state: any) => void)[]>()

  constructor(scenes: readonly Scene[]) {
    this.addStateHandler(new SceneStateHandler(this))
    this.addStateHandler(new SelectionStateHandler(this))
    this.addStateHandler(new AlgorithmStateHandler(this))
    this.addStateHandler(new ScenesStateHandler(scenes, this))
  }

  get<TState>(definition: StateIdentifier<TState>): TState {
    const entry = this.states.get(definition.type)
    if (entry == undefined) {
      throw new Error(`Invalid state: ${definition.type}`)
    }
    return entry as TState
  }

  subscribeUpdate<TState>(definition: StateIdentifier<TState>, update: (state: TState) => void): void {
    const subscribers = this.updateSubscribers.get(definition.type);
    if (subscribers == undefined) {
      this.updateSubscribers.set(definition.type, [update]);
    } else {
      subscribers.push(update)
    }
  }

  updated<TState>(definition: StateIdentifier<TState>): void {
    this.currentScene.updated(definition)
    const subscribers = this.updateSubscribers.get(definition.type);
    if (subscribers == undefined) return
    const state = this.get(definition)
    for (const handler of subscribers) {
      handler(state as any as TState)
    }
  }

  newScene() {
    this.currentScene = new SceneStateManager(this)
    return this.currentScene
  }

  private addStateHandler<TState>(state: State<TState>) {
    this.states.set(state.identifier.type, state)
  }
}
