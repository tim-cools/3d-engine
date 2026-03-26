import {EventDispatcher} from "./events"
import {StateManager} from "./state"

export interface ApplicationContext {
  readonly events: EventDispatcher
  readonly state: StateManager
}
