import {PublishStateEvents} from "./stateManager"

export class StateIdentifier<TScene> {

  readonly type: string

  constructor(type: string) {
    this.type = type
  }
}


export abstract class State<TState> {

  readonly identifier: StateIdentifier<TState>

  protected constructor(identifier: StateIdentifier<TState>, private publishStateEvents: PublishStateEvents) {
    this.identifier = identifier
  }

  protected updated() {
    this.publishStateEvents.updated(this.identifier)
  }
}
