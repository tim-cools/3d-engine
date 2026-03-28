import {EventDispatcher} from "./events"
import {StateManager} from "./state"
import {UIElement} from "./ui/uiElement"

export interface ApplicationContext {
  readonly events: EventDispatcher
  readonly state: StateManager

  unsubscribeElement(contentValue: UIElement): void
  unsubscribeElements(previousElements: readonly UIElement[], newElements: readonly UIElement[]): void
}
