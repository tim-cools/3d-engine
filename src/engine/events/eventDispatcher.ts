import {Event} from "./event"
import {UIElement} from "../ui/uiElement"

export interface EventDispatcher {
  subscribe<TEvent extends Event>(type : new () => TEvent, element: UIElement, param: (event: TEvent) => void): void
  publish<TEvent extends Event>(type : new () => TEvent, event: TEvent): void
}
