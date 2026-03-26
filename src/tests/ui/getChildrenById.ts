import {UIElement} from "../../engine/ui/uiElement"
import {UIElementType} from "../../engine/ui/uiElementType"
import {Identifier, nothing, Nothing} from "../../infrastructure/nothing"

function getElementChildrenOfType(element: UIElement, elementType: UIElementType, result: UIElement[]) {
  if (element.elementType == elementType) {
    result.push(element)
  }
  for (const child of element.children) {
    getElementChildrenOfType(child, elementType, result)
  }
}

export function getChildrenOfType(element: UIElement, elementType: UIElementType) {
  const result: UIElement[] = []
  getElementChildrenOfType(element, elementType, result)
  return result
}

function getElementChildrenById(element: UIElement, parentId: Identifier | Nothing, idEnd: Identifier, result: UIElement[]) {
  const path = parentId != nothing ? `${parentId}.${element.id}` : element.id
  if (path.endsWith(idEnd)) {
    result.push(element)
  }
  for (const child of element.children) {
    getElementChildrenById(child, path, idEnd, result)
  }
}

export function getChildrenById(element: UIElement, idEnd: Identifier) {
  const result: UIElement[] = []
  getElementChildrenById(element, "", idEnd, result)
  return result
}

function logElements(element: UIElement) {

  const result: string[] = []

  function logElementLines(element: UIElement, indent: number = 0) {
    result.push(`${" ".repeat(indent) + UIElementType[element.elementType]}: ${element.id}`)
    for (const child of element.children) {
      logElementLines(child, indent + 2)
    }
  }

  logElementLines(element)
  return result.join("\n")
}
