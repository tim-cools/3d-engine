import {EventDispatcher, ApplicationEventDispatcher, SceneEventDispatcher} from "../events"
import {ApplicationContext} from "../applicationContext"
import {Scene} from "./scene"
import {ApplicationStateManager, SceneStateManager} from "../state"
import {UIElement} from "../ui/uiElement"

export class SceneContext implements ApplicationContext {

  readonly state: SceneStateManager
  readonly events: EventDispatcher

  constructor(state: SceneStateManager, events: SceneEventDispatcher) {
    this.state = state
    this.events = events
  }

  unsubscribeElement(contentValue: UIElement): void {
    this.events.unsubscribeElement(contentValue)
    this.state.unsubscribeElement(contentValue)
  }

  unsubscribeElements(previousElements: readonly UIElement[], newElements: readonly UIElement[]): void {
    for (const previousElement of previousElements) {
      if (newElements.indexOf(previousElement) < 0) {
        this.unsubscribe(previousElement)
      }
    }
  }

  private unsubscribe(element: UIElement) {
    this.unsubscribeElement(element)
    for (const child of element.children) {
      this.unsubscribe(child)
    }
  }
}

export class Context implements ApplicationContext {

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

  unsubscribeElement(contentValue: UIElement): void {
    this.events.unsubscribeElement(contentValue)
    this.state.unsubscribeElement(contentValue)
  }

  unsubscribeElements(previousElements: readonly UIElement[], newElements: readonly UIElement[]): void {
    for (const previousElement of previousElements) {
      if (newElements.indexOf(previousElement) < 0) {
        this.unsubscribe(previousElement)
      }
    }
  }

  private unsubscribe(element: UIElement) {
    this.unsubscribeElement(element)
    for (const child of element.children) {
      this.unsubscribe(child)
    }
  }
}
