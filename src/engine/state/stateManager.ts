import {State, StateIdentifier} from "./state"
import {SceneStateHandler} from "./sceneState"
import {SelectionStateHandler} from "./selectionState"
import {ScenesStateHandler} from "./scenesState"
import {Scene} from "../scenes"
import {Context} from "../context"
import {ObjectStateHandler} from "./objectState"
import {UIElement} from "../ui/uiElement"
import {nothing, Nothing} from "../../infrastructure/nothing"

export interface PublishStateEvents {
  updated<TState>(definition: StateIdentifier<TState>): void
}

export interface StateManager {
  get<TState>(definition: StateIdentifier<TState>): TState
  subscribeUpdate<TState>(definition: StateIdentifier<TState>, update: (state: TState) => void, element: UIElement | Nothing): void
  unsubscribeElement(element: UIElement): void
}

type SubscriberEntry = {
  element: UIElement | Nothing,
  handler: ((state: any) => void)
}

export class SceneStateManager implements StateManager {

  private updateSubscribers = new Map<string, SubscriberEntry[]>()

  constructor(private applicationStateManager: ApplicationStateManager) {
  }

  get<TState>(definition: StateIdentifier<TState>): TState {
    return this.applicationStateManager.get(definition)
  }

  subscribeUpdate<TState>(definition: StateIdentifier<TState>, update: (state: TState) => void, element: UIElement | Nothing = nothing): void {
    const subscribers = this.updateSubscribers.get(definition.type);
    const entry = {handler: update, element: element}
    if (subscribers == undefined) {
      this.updateSubscribers.set(definition.type, [entry]);
    } else {
      subscribers.push(entry)
    }
  }

  unsubscribeElement(element: UIElement): void {
    const values = Array.from(this.updateSubscribers.values())
    for (const value of values) {
      for (let index = 0; index < value.length; index++){
        const valueElement = value[index]
        if (valueElement.element === element) {
          value.splice(index, 1)
        } else {
          index++
        }
      }
    }
  }

  updated<TState>(definition: StateIdentifier<TState>): void {

    const subscribers = this.updateSubscribers.get(definition.type);
    if (subscribers == undefined) return

    const state = this.get(definition)
    for (const subscriber of subscribers) {
      subscriber.handler(state as any as TState)
    }
  }
}

export class ApplicationStateManager implements StateManager {

  private currentScene: SceneStateManager = new SceneStateManager(this)
  private states = new Map<string, any>()
  private updateSubscribers = new Map<string, SubscriberEntry[]>()

  constructor(private scenes: readonly Scene[]) {
  }

  initialize(context: Context) {
    this.addStateHandler(new ScenesStateHandler(this.scenes, this))
    this.addStateHandler(new SelectionStateHandler(this))
    this.addStateHandler(new ObjectStateHandler(this))
    this.addStateHandler(new SceneStateHandler(this.scenes, this, context))
  }

  get<TState>(definition: StateIdentifier<TState>): TState {
    const entry = this.states.get(definition.type)
    if (entry == undefined) {
      throw new Error(`Invalid state: ${definition.type}`)
    }
    return entry as TState
  }

  unsubscribeElement(element: UIElement): void {
    const values = Array.from(this.updateSubscribers.values())
    for (const value of values) {
      for (let index = 0; index < value.length; index++){
        const valueElement = value[index]
        if (valueElement.element === element) {
          value.splice(index, 1)
        } else {
          index++
        }
      }
    }
  }

  subscribeUpdate<TState>(definition: StateIdentifier<TState>, update: (state: TState) => void, element: UIElement | Nothing): void {
    const subscribers = this.updateSubscribers.get(definition.type);
    const entry = {handler: update, element: element}
    if (subscribers == undefined) {
      this.updateSubscribers.set(definition.type, [entry]);
    } else {
      subscribers.push(entry)
    }
  }

  updated<TState>(definition: StateIdentifier<TState>): void {

    this.currentScene.updated(definition)

    const subscribers = this.updateSubscribers.get(definition.type);
    if (subscribers == undefined) return

    const state = this.get(definition)
    for (const subscriber of subscribers) {
      subscriber.handler(state as any as TState)
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
