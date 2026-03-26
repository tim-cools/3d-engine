import {State, StateIdentifier} from "./state"
import {Lazy} from "../../infrastructure/lazy"

export interface StateHandler<TState> {
  readonly identifier: StateIdentifier<TState>
  readonly state: State<TState>
}

export abstract class StateHandlerBase<TState> implements StateHandler<TState> {

  private stateValue: Lazy<State<TState>>

  readonly identifier: StateIdentifier<TState>

  get state(): State<TState> {
    return this.stateValue.value
  }

  protected constructor(identifier: StateIdentifier<TState>) {
    this.identifier = identifier
    this.stateValue = new Lazy<State<TState>>(() => new State<TState>(this.createState()))
  }

  protected abstract createState(): TState
}
