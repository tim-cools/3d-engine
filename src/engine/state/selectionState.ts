import {State, StateIdentifier} from "./state"
import {PublishStateEvents} from "./stateManager"

export const SelectionStateIdentifier = new StateIdentifier("selection")

export interface SelectionState {
  readonly faceIds: number[]
}

export class SelectionStateHandler extends State<SelectionState> implements SelectionState {

  faceIds: [] = []

  constructor(publishStateEvents: PublishStateEvents) {
    super(SelectionStateIdentifier, publishStateEvents)
  }
}
