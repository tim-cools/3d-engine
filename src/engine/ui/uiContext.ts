import {ApplicationContext} from "../applicationContext"
import {UIElement} from "./uiElement"

export interface UIContext extends ApplicationContext {
  attachElement(element: UIElement): void
  attachElements(elements: readonly UIElement[]): void
  detachElement(element: UIElement): void
  detachElements(elements: readonly UIElement[]): void
}
