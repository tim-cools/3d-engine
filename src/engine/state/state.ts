import {Lazy} from "../../infrastructure/lazy"

export class StateIdentifier<TScene> {

  readonly type: string

  constructor(type: string) {
    this.type = type
  }
}

export interface UpdatableState<TState> {
  onUpdate(handler: (state: TState) => void): void
}

export abstract class State<TState> implements UpdatableState<TState> {

  private readonly updateSubscribers: ((state: TState) => void)[] = []

  readonly identifier: StateIdentifier<TState>

  protected constructor(identifier: StateIdentifier<TState>) {
    this.identifier = identifier
  }

  onUpdate(handler: (state: TState) => void) {
    this.updateSubscribers.push(handler)
  }

  protected updated() {
    this.notifySubscribers()
  }

  private notifySubscribers() {
    for (const handler of this.updateSubscribers) {
      handler(this as any as TState)
    }
  }
}
