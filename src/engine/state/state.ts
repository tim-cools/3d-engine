
export class StateIdentifier<TScene> {

  readonly type: string

  constructor(type: string) {
    this.type = type
  }
}

export class State<TState> {

  private readonly updateSubscribers: ((state: TState) => void)[] = []

  private stateValue: TState

  get current(): TState {
    return this.stateValue
  }

  constructor(state: TState) {
    this.stateValue = state
  }

  update(update: (state: TState) => TState) {
    this.stateValue = update(this.stateValue)
    setTimeout(() => this.notifySubscribers(), 0)
  }

  private notifySubscribers() {
    for (const handler of this.updateSubscribers) {
      handler(this.stateValue)
    }
  }

  onUpdate(handler: (state: TState) => void) {
    this.updateSubscribers.push(handler)
  }
}
