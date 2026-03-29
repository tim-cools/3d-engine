import {EventDispatcher, SceneEventDispatcher} from "../events"
import {ApplicationContext} from "../applicationContext"
import {SceneStateManager} from "../state"

export class SceneContext implements ApplicationContext {

  readonly state: SceneStateManager
  readonly events: EventDispatcher

  constructor(state: SceneStateManager, events: SceneEventDispatcher) {
    this.state = state
    this.events = events
  }
}

