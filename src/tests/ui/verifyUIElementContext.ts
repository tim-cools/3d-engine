import {UIElement} from "../../engine/ui/uiElement"
import {VerifyModelContext} from "../infrastructure"
import {UIElementType} from "../../engine/ui/uiElementType"
import {Text} from "../../engine/ui/controls"
import {getChildrenById} from "./getChildrenById"
import {Nothing, nothing} from "../../infrastructure/nothing"
import {Link} from "../../engine/ui/controls/link"
import {CollapsablePanel} from "../../engine/ui/layout/collapsablePanel"

export class VerifyUIElementContext {

  private readonly element: UIElement

  constructor(private context: VerifyModelContext<UIElement>) {
    this.element = context.model
  }

  textWith(idEnd: string, value: string): VerifyUIElementContext {

    const element = this.getElement<Text>(idEnd, UIElementType.Text)
    if (element == nothing) return this

    this.context.logging.logAssert(element.value == value, ` value: ${value}`, `element: ${idEnd} value is: '${element.value}'`)

    return this
  }

  linkWith(idEnd: string, value: string) {

    const element = this.getElement<Link>(idEnd, UIElementType.Link)
    if (element == nothing) return this

    this.context.logging.logAssert(element.title == value, ` value: ${value}`, `element: ${idEnd} value is: '${element.title}'`)

    return this
  }


  panelWith(idEnd: string, value: string) {

    const element = this.getElement<CollapsablePanel>(idEnd, UIElementType.Panel)
    if (element == nothing) return this

    this.context.logging.logAssert(element.title == value, ` value: ${value}`, `element: ${idEnd} value is: '${element.title}'`)

    return this
  }

  private getElement<TElement extends UIElement>(idEnd: string, type: UIElementType): TElement | Nothing {
    const elements = getChildrenById(this.element, idEnd)
    if (elements.length == 0) {
      this.context.fail("No element found with id: " + idEnd)
      return nothing
    } else if (elements.length > 1) {
      this.context.fail(`More than one element found with id: ${idEnd}: ${elements.length}`)
      return nothing
    } else if (elements[0].elementType != type) {
      this.context.fail(`Element not of type 'Text'. Actual: ${UIElementType[elements[0].elementType]}`)
      return nothing
    }
    return elements[0] as TElement
  }
}
