import {EventDispatcher} from "../events/eventDispatcher"
import {State} from "../state/state"
import {SceneState} from "../state/sceneState"
import {SelectionState} from "../state/selectionState"
import {AlgorithmState} from "../state/algorithmState"
import {ScenesState} from "../state/scenesState"

export interface SceneContext {
  readonly events: EventDispatcher
  readonly scene: State<SceneState>
  readonly scenes: State<ScenesState>
  readonly selection: State<SelectionState>
  readonly algorithm: State<AlgorithmState>
}
