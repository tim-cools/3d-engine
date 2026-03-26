import {EventDispatcher, ApplicationEventDispatcher, SceneEventDispatcher} from "../events"
import {ApplicationContext} from "../applicationContext"
import {Scene} from "./scene"
import {ApplicationStateManager, SceneStateManager} from "../state/stateManager"

export class SceneContext implements ApplicationContext {

  readonly state: SceneStateManager
  readonly events: EventDispatcher

  constructor(state: SceneStateManager, events: SceneEventDispatcher) {
    this.events = events
    this.state = state
  }
}

export class Context implements ApplicationContext {

  readonly events: ApplicationEventDispatcher
  readonly state: ApplicationStateManager

  constructor(scenes: readonly Scene[]) {
    this.events = new ApplicationEventDispatcher()
    this.state = new ApplicationStateManager(scenes)
  }

  newScene(): ApplicationContext {
    return new SceneContext(this.state.newScene(), this.events.newScene())
  }
}
