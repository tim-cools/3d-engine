import {EventDispatcher} from "./events/eventDispatcher"
import {State, StateIdentifier} from "./state/state"

export interface ApplicationContext {
  readonly events: EventDispatcher
  state<TState>(definition: StateIdentifier<TState>): TState
}
