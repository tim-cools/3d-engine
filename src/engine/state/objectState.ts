import {State, StateIdentifier} from "./state"
import {Object} from "../objects"
import {PublishStateEvents} from "./stateManager"
import {nothing, Nothing} from "../../infrastructure/nothing"

export const ObjectStateType = new StateIdentifier<ObjectState>("object")

export interface ObjectState {

  readonly current: Object | Nothing

  setObject(object: Object | Nothing): void
}

export class ObjectStateHandler extends State<ObjectState> implements ObjectState {

  current: Object | Nothing = nothing

  constructor(publishStateEvents: PublishStateEvents) {
    super(ObjectStateType, publishStateEvents)
  }

  setObject(object: Object) {
    this.current = object
    this.updated()
  }
}
