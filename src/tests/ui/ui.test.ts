import {UI} from "../../engine/ui"
import {Context} from "../../engine/scenes/sceneContext"
import {Scene} from "../../engine/scenes"
import {ScenesInfo} from "../../engine/ui/content/scenesInfo"
import {UIElementType} from "../../engine/ui/uiElementType"
import {Verify, VerifyModelContext} from "../infrastructure"
import {Link} from "../../engine/ui/controls/link"
import {SceneInfo} from "../../engine/ui/content/sceneInfo"
import {SceneStateIdentifier} from "../../engine/state/sceneState"
import {AlgorithmStateIdentifier} from "../../engine/state/algorithmState"
import {getChildrenOfType} from "./getChildrenById"
import {VerifyUIElementContext} from "./verifyUIElementContext"

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

    Verify.model(info, context => new VerifyUIElementContext(context)
      .textWith("renderStyle.value", "Solid")
      .textWith("renderModel.value", "Result")
      .textWith("algorithm.value", "SubtractFaces")
    )
  })

  test('create SceneInfo witch values', async () => {

    const context = new Context([])
    let sceneState = context.state.get(SceneStateIdentifier)
    sceneState.switchRenderStyle()
    sceneState.switchRenderModel()

    let algorithmState = context.state.get(AlgorithmStateIdentifier)
    algorithmState.switchAlgorithm()

    const info = new SceneInfo(context)

    Verify.model(info, context => new VerifyUIElementContext(context)
      .textWith("renderStyle.value", "WireframeDebug")
      .textWith("renderModel.value", "Master")
      .textWith("algorithm.value", "SubtractSegments")
    )
  })
})
