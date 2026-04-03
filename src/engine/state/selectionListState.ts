import {State, StateIdentifier} from "./state"
import {PublishStateEvents} from "./stateManager"
import {nothing} from "../../infrastructure/nothing"
import {SceneStateType} from "./sceneState"
import {Context} from "../context"
import {KeyDown} from "../events"
import {SelectionStateType} from "./selectionState"
import {PrimitiveSource} from "../models"

export const SelectionListStateType = new StateIdentifier<SelectionListState>("selectionList")

export interface SelectionListState {

  readonly primitives: PrimitiveSource[]

  select(primitive: PrimitiveSource): void
  remove(primitive: PrimitiveSource): void
}

export class SelectionListStateHandler extends State<SelectionListState> implements SelectionListState {

  primitives: PrimitiveSource[] = []

  constructor(publishStateEvents: PublishStateEvents, private context: Context) {
    super(SelectionListStateType, publishStateEvents)
    context.state.subscribeUpdate(SceneStateType, () => this.clear(), nothing)
    context.events.subscribe(KeyDown, event => this.keyDown(event), nothing)
  }

  select(primitive: PrimitiveSource) {
    const id = primitive.primitive.id
    const selected = this.primitives.findIndex(where => where.primitive.id == id)
    if (selected < 0) {
      this.primitives.push(primitive)
    } else {
      this.primitives.splice(selected, 1)
    }

    const selectionState = this.context.state.get(SelectionStateType)
    if (selectionState.selected != nothing && selectionState.selected.id == id) {
      selectionState.selected = nothing
    }
    this.updated()
  }

  remove(primitive: PrimitiveSource) {
    const id = primitive.primitive.id
    const selected = this.primitives.findIndex(where => where.primitive.id == id)
    if (selected >= 0) {
      this.primitives.splice(selected, 1)
    }
    this.updated()
  }

  private clear() {
    this.primitives = []
    this.updated()
  }

  private keyDown(event: KeyDown) {
    if (event.key == "g") {
      this.toggleInGroup()
    }
  }

  private toggleInGroup() {
    const selectionState = this.context.state.get(SelectionStateType)
    const selected = selectionState.selected
    if (selected != nothing) {
      this.select(selected)
    }
  }
}
