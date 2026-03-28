import {State, StateIdentifier} from "./state"
import {PublishStateEvents} from "./stateManager"

export const SelectionStateType = new StateIdentifier<SelectionState>("selection")

export interface SelectionState {
  readonly faceIds: number[]
  select(id: number): void
}

export class SelectionStateHandler extends State<SelectionState> implements SelectionState {

  faceIds: number[] = []

  constructor(publishStateEvents: PublishStateEvents) {
    super(SelectionStateType, publishStateEvents)
  }

  select(id: number) {
    if (this.faceIds.indexOf(id) < 0) {
      this.faceIds.push(id)
    }
    this.updated()
  }
}
