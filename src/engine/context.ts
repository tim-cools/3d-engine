import {ApplicationContext} from "./applicationContext"
import {ApplicationEventDispatcher} from "./events"
import {ApplicationStateManager} from "./state"
import {Scene, SceneContext} from "./scenes"
import {UIElement} from "./ui/uiElement"
import {UIContext} from "./ui/uiContext"
import {nothing, Nothing} from "../infrastructure/nothing"
import {UIElementType} from "./ui/uiElementType"

export class Context implements ApplicationContext, UIContext {

  readonly events: ApplicationEventDispatcher
  readonly state: ApplicationStateManager

  constructor(scenes: readonly Scene[]) {
    this.events = new ApplicationEventDispatcher()
    this.state = new ApplicationStateManager(scenes)
    this.state.initialize(this)
  }

  newScene(): ApplicationContext {
    return new SceneContext(this.state.newScene(), this.events.newScene())
  }

  attachElement(element: UIElement, index: number | Nothing = nothing) {
    element.attachContext(this)
    Context.ensureId(index, element)
    this.attachElements(element.children)
  }

  attachElements(elements: readonly UIElement[]) {
    this.walkElements(elements, (element, index) => this.attachElement(element, index))
  }

  detachElement(element: UIElement) {
    this.unsubscribeElement(element)
    element.detachContext()
    this.detachElements(element.children)
  }

  detachElements(elements: readonly UIElement[]) {
    this.walkElements(elements, element => this.detachElement(element))
  }

  private static ensureId(index: number | null, element: UIElement) {
    if (index != nothing) {
      element.ensureId(UIElementType[element.elementType] + index.toString())
    } else {
      element.ensureId(UIElementType[element.elementType])
    }
  }

  private unsubscribeElement(contentValue: UIElement): void {
    this.events.unsubscribeElement(contentValue)
    this.state.unsubscribeElement(contentValue)
  }

  private walkElement(element: UIElement, index: number | Nothing, handler: (element: UIElement, index: number | Nothing) => void) {
    handler(element, index)
    this.walkElements(element.children, handler)
  }

  private walkElements(elements: readonly UIElement[], handler: (element: UIElement, index: number | Nothing) => void) {
    for (let index = 0; index < elements.length; index++){
      const child = elements[index]
      this.walkElement(child, elements.length != 1 ? index : nothing, handler)
    }
  }
}
