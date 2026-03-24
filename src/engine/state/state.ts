export class State<T> {

  private readonly handlers: ((state: T) => void)[] = []

  private stateValue: T

  get value(): T {
    return this.stateValue
  }

  constructor(value: T) {
    this.stateValue = value
  }

  update(update: (state: T) => T) {
    this.stateValue = update(this.stateValue)
    for (const handler of this.handlers) {
      handler(this.stateValue)
    }
  }

  onUpdate(handler: (state: T) => void) {
    this.handlers.push(handler)
  }
}
