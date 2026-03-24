import {EventDispatcher} from "../events/eventDispatcher"
import {State} from "../state/state"
import {SceneState} from "../state/sceneState"
import {SelectionState} from "../state/selectionState"
import {AlgorithmState} from "../state/algorithmState"

export interface SceneContext {
  readonly events: EventDispatcher
  readonly scene: State<SceneState>
  readonly selection: State<SelectionState>
  readonly algorithm: State<AlgorithmState>
}
