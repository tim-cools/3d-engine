import {StateIdentifier} from "./state"
import {StateHandlerBase} from "./stateHandler"

export const SelectionStateIdentifier = new StateIdentifier("selection")

export interface SelectionState {
  readonly faceIds: number[]
}

export class SelectionStateHandler extends StateHandlerBase<SelectionState> {

  constructor() {
    super(SelectionStateIdentifier)
  }

  protected createState(): SelectionState {
    return {
      faceIds: []
    }
  }
}
