import {Event} from "./event"
import {UIElement} from "../ui/uiElement"
import {Nothing} from "../../infrastructure/nothing"

export interface EventDispatcher {
  subscribe<TEvent extends Event>(type: { new(): TEvent }, param: (event: TEvent) => void, element: UIElement | Nothing): void
  unsubscribeElement(element: UIElement): void
  publish<TEvent extends Event>(event: TEvent): void
}
