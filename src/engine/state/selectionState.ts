import {State, StateIdentifier} from "./state"
import {PublishStateEvents} from "./stateManager"
import {nothing, Nothing} from "../../infrastructure/nothing"
import {SceneStateType} from "./sceneState"
import {Context} from "../context"
import {PrimitiveSource} from "../models"

export const SelectionStateType = new StateIdentifier<SelectionState>("selection")

export interface SelectionState {
  selected: PrimitiveSource | Nothing
  hover: PrimitiveSource | Nothing
}

export class SelectionStateHandler extends State<SelectionState> implements SelectionState {

  private hoverValue: PrimitiveSource | Nothing = nothing
  private selectedValue: PrimitiveSource | Nothing = nothing

  get hover(): PrimitiveSource | Nothing {
    return this.hoverValue
  }

  set hover(primitive: PrimitiveSource | Nothing) {
    this.hoverValue = primitive
    this.updated()
  }

  get selected(): PrimitiveSource | Nothing {
    return this.selectedValue
  }

  set selected(primitive: PrimitiveSource | Nothing) {
    this.selectedValue = primitive
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
