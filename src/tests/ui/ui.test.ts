import {UI} from "../../engine/ui"
import {UIElement} from "../../engine/ui/uiElement"
import {Context} from "../../engine/scenes/sceneContext"
import {Scene} from "../../engine/scenes"
import {ScenesInfo} from "../../engine/ui/content/scenesInfo"
import {UIElementType} from "../../engine/ui/uiElementType"
import {Verify, VerifyModelContext} from "../infrastructure"
import {Link} from "../../engine/ui/controls/link"
import {SceneInfo} from "../../engine/ui/content/sceneInfo"
import {Identifier, nothing, Nothing} from "../../infrastructure/nothing"
import {Text} from "../../engine/ui/controls"
import {SceneStateIdentifier} from "../../engine/state/sceneState"
import {AlgorithmStateIdentifier} from "../../engine/state/algorithmState"

class UIElementContext {

  private element: UIElement

  constructor(private context: VerifyModelContext<UIElement>) {
    this.element = context.model
  }

  textWith(idEnd: string, value: string): UIElementContext {
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

function getElementChildrenOfType(element: UIElement, elementType: UIElementType, result: UIElement[]) {
  if (element.elementType == elementType) {
    result.push(element)
  }
  for (const child of element.children) {
    getElementChildrenOfType(child, elementType, result)
  }
}

function getChildrenOfType(element: UIElement, elementType: UIElementType) {
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

function getChildrenById(element: UIElement, idEnd: Identifier) {
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

describe('ui', () => {

  test('create UI', async () => {
    const context = new Context([
      new Scene("test", () => [])
    ])
    const ui = new UI(context)
  })

  test('create ScenesInfo with links', async () => {

    const context = new Context([
      new Scene("test 1", () => []),
      new Scene("test 2", () => []),
      new Scene("test 3", () => [])
    ])

    const info = new ScenesInfo(context)
    const links = getChildrenOfType(info, UIElementType.Link) as Link[]

    Verify.collection(links, context => context
      .length(3, "links")
      .valueAt(0, item => item.title == "test 1", "element 1")
      .valueAt(1, item => item.title == "test 2", "element 2")
      .valueAt(2, item => item.title == "test 3", "element 3")
    )
  })

  test('create SceneInfo default values', async () => {

    const context = new Context([])

    const info = new SceneInfo(context)

    console.log(logElements(info))

    Verify.model(info, context => new UIElementContext(context)
      .textWith("renderStyle.value", "Solid")
      .textWith("renderModel.value", "Result")
      .textWith("algorithm.value", "SubtractFaces")
    )
  })

  test('create SceneInfo witch values', async () => {

    const context = new Context([])
    let sceneState = context.state(SceneStateIdentifier)
    sceneState.switchRenderStyle()
    sceneState.switchRenderModel()

    let algorithmState = context.state(AlgorithmStateIdentifier)
    algorithmState.switchAlgorithm()

    const info = new SceneInfo(context)

    console.log(logElements(info))

    Verify.model(info, context => new UIElementContext(context)
      .textWith("renderStyle.value", "WireframeDebug")
      .textWith("renderModel.value", "Master")
      .textWith("algorithm.value", "SubtractSegments")
    )
  })
})
