import {Event} from "./event"
import {UIElement} from "../ui/uiElement"
import {Nothing} from "../../infrastructure/nothing"

export interface EventDispatcher {
  subscribe<TEvent extends Event>(type : new () => TEvent, element: UIElement | Nothing, param: (event: TEvent) => void): void
  unsubscribeElement(element: UIElement): void
  publish<TEvent extends Event>(event: TEvent): void
}
