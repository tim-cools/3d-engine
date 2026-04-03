import {createTestContext} from "../testContext"
import {Scene} from "../../../engine/scenes"
import {ScenesList} from "../../../engine/ui/content/scenesList"
import {getChildrenOfType} from "../getChildrenById"
import {UIElementType} from "../../../engine/ui/uiElementType"
import {Link} from "../../../engine/ui/controls"
import {Verify} from "../../infrastructure"

describe('ScenesList', () => {

  test('create ScenesList with links', async () => {

    const context = createTestContext([
      new Scene("test 1", () => []),
      new Scene("test 2", () => []),
      new Scene("test 3", () => [])
    ])

    const info = new ScenesList()
    context.attachElement(info)

    const links = getChildrenOfType(info, UIElementType.Link) as Link[]

    Verify.collection(links, context => context
      .length(3, "links")
      .valueAt(0, item => item.title == "test 1", "element 1")
      .valueAt(1, item => item.title == "test 2", "element 2")
      .valueAt(2, item => item.title == "test 3", "element 3")
    )
  })
})
