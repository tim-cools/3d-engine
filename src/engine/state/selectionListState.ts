import {State, StateIdentifier} from "./state"
import {PublishStateEvents} from "./stateManager"
import {nothing, Nothing} from "../../infrastructure/nothing"
import {Id} from "../ui/id"
import {SceneStateType} from "./sceneState"
import {Context} from "../context"
import {KeyDown} from "../events"
import {SelectionStateType} from "./selectionState"

export const SelectionListStateType = new StateIdentifier<SelectionListState>("selectionList")

export interface SelectionListState {

  readonly faceIds: string[]

  select(id: string): void
  remove(id: string): void
}

export class SelectionListStateHandler extends State<SelectionListState> implements SelectionListState {

  faceIds: string[] = []

  constructor(publishStateEvents: PublishStateEvents, private context: Context) {
    super(SelectionListStateType, publishStateEvents)
    context.state.subscribeUpdate(SceneStateType, () => this.clear(), nothing)
    context.events.subscribe(KeyDown, event => this.keyDown(event), nothing)
  }

  select(id: string) {
    const selected = this.faceIds.indexOf(id)
    if (selected < 0) {
      this.faceIds.push(id)
    } else {
      this.faceIds.splice(selected, 1)
    }

    const selectionState = this.context.state.get(SelectionStateType)
    if (selectionState.selected == id) {
      selectionState.selected = nothing
    }
    this.updated()
  }

  remove(id: string) {
    const selected = this.faceIds.indexOf(id)
    if (selected >= 0) {
      this.faceIds.splice(selected, 1)
    }
    this.updated()
  }

  private clear() {
    this.faceIds = []
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
