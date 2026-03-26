import {UIElement} from "../../engine/ui/uiElement"
import {VerifyModelContext} from "../infrastructure"
import {UIElementType} from "../../engine/ui/uiElementType"
import {Text} from "../../engine/ui/controls"
import {getChildrenById} from "./getChildrenById"

export class VerifyUIElementContext {

  private readonly element: UIElement

  constructor(private context: VerifyModelContext<UIElement>) {
    this.element = context.model
  }

  textWith(idEnd: string, value: string): VerifyUIElementContext {
    const elements = getChildrenById(this.element, idEnd)
    if (elements.length == 0) {
      this.context.fail("No element found with id: " + idEnd)
    } else if (elements.length > 1) {
      this.context.fail(`More than one element found with id: ${idEnd}: ${elements.length}`)
    } else if (elements[0].elementType != UIElementType.Text) {
      this.context.fail(`Element not of type 'Text'. Actual: ${elements[0].elementType}`)
    } else {
      const element = elements[0] as Text
      this.context.logging.logAssert(element.value == value, ` value: ${value}`, `element: ${idEnd} value is: '${element.value}'`)
    }
    return this
  }
}
