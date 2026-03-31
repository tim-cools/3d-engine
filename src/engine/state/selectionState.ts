import {State, StateIdentifier} from "./state"
import {PublishStateEvents} from "./stateManager"
import {nothing, Nothing} from "../../infrastructure/nothing"
import {Id} from "../ui/id"
import {SceneStateType} from "./sceneState"
import {Context} from "../context"

export const SelectionStateType = new StateIdentifier<SelectionState>("selection")

export interface SelectionState {
  selected: Id | Nothing
  hover: Id | Nothing
}

export class SelectionStateHandler extends State<SelectionState> implements SelectionState {

  private hoverValue: Id | Nothing = nothing
  private selectedValue: Id | Nothing = nothing

  get hover(): Id | Nothing {
    return this.hoverValue
  }

  set hover(id: Id | Nothing) {
    this.hoverValue = id
    this.updated()
  }

  get selected(): Id | Nothing {
    return this.selectedValue
  }

  set selected(id: Id | Nothing) {
    this.selectedValue = id
    this.updated()
  }

  constructor(publishStateEvents: PublishStateEvents, context: Context) {
    super(SelectionStateType, publishStateEvents)
    context.state.subscribeUpdate(SceneStateType, () => this.clear(), nothing)
  }

  private clear() {
    console.log("set hover clear")
    this.selected = nothing
    this.hover = nothing
    this.updated()
  }
}
