import {UI} from "../../engine/ui"
import {Context} from "../../engine/scenes"
import {Scene} from "../../engine/scenes"
import {ScenesList} from "../../engine/ui/content/scenesList"
import {UIElementType} from "../../engine/ui/uiElementType"
import {Verify} from "../infrastructure"
import {Link} from "../../engine/ui/controls/link"
import {getChildrenOfType} from "./getChildrenById"
import {VerifyUIElementContext} from "./verifyUIElementContext"
import {ObjectsList} from "../../engine/ui/content/objectsList"
import {ApplicationContext} from "../../engine/applicationContext"
import {ModelObject} from "../../engine/objects"
import {Point, Size, SpaceModel, CubeModel} from "../../engine/models"
import {ObjectDetails} from "../../engine/ui/content/objectDetails"
import {ObjectStateType} from "../../engine/state/objectState"
import {SceneStateType} from "../../engine/state"

describe('ui', () => {

  test('create UI', async () => {
    const context = new Context([
      new Scene("test", () => [])
    ])
    const ui = new UI(context)
  })

  test('create ScenesList with links', async () => {

    const context = new Context([
      new Scene("test 1", () => []),
      new Scene("test 2", () => []),
      new Scene("test 3", () => [])
    ])

    const info = new ScenesList(context)
    const links = getChildrenOfType(info, UIElementType.Link) as Link[]

    Verify.collection(links, context => context
      .length(3, "links")
      .valueAt(0, item => item.title == "test 1", "element 1")
      .valueAt(1, item => item.title == "test 2", "element 2")
      .valueAt(2, item => item.title == "test 3", "element 3")
    )
  })

  function newObject(id: string, context: ApplicationContext) {
    const cube =  CubeModel.create(1)
    const spaceModel = new SpaceModel(cube, Point.null, Size.null)
    return new ModelObject(context, id, spaceModel)
  }

  test('create ObjectList default values', async () => {

    const context = new Context([
      new Scene("test 1", context => [
        newObject("model1", context),
        newObject("model2", context),
        newObject("model3", context),
      ])
    ])

    const info = new ObjectsList(context)

    Verify.model(info, context => new VerifyUIElementContext(context)
      .linkWith("link.model1", "model1")
      .linkWith("link.model2", "model2")
      .linkWith("link.model3", "model3")
    )
  })

  test('create ObjectList default values', async () => {

    const context = new Context([
      new Scene("test 1", context => [
        newObject("model1", context),
        newObject("model2", context),
        newObject("model3", context),
      ])
    ])

    const info = new ObjectDetails(context)

    Verify.model(info, context => new VerifyUIElementContext(context)
      .panelWith("objectDetails", "Object: model1")
    )
  })

  test('create ObjectList select object', async () => {

    const context = new Context([
      new Scene("test 1", context => [
        newObject("model1", context),
        newObject("model2", context),
        newObject("model3", context),
      ])
    ])

    const sceneState = context.state.get(SceneStateType)
    const objectState = context.state.get(ObjectStateType)
    objectState.setObject(sceneState.objects[1])

    const info = new ObjectDetails(context)

    Verify.model(info, context => new VerifyUIElementContext(context)
      .panelWith("objectDetails", "Object: model2")
    )
  })
})
