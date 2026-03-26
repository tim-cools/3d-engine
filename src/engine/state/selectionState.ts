import {State, StateIdentifier, UpdatableState} from "./state"

export const SelectionStateIdentifier = new StateIdentifier("selection")

export interface SelectionState extends UpdatableState<SelectionState> {
  readonly faceIds: number[]
}

export class SelectionStateHandler extends State<SelectionState> implements SelectionState {

  faceIds: [] = []

  constructor() {
    super(SelectionStateIdentifier)
  }
}
