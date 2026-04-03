import {createTestContext} from "../testContext"
import {Scene} from "../../../engine/scenes"
import {newObject} from "./newObject"
import {ObjectDetails} from "../../../engine/ui/content/objectDetails"
import {VerifyUIElementContext} from "../verifyUIElementContext"
import {Verify} from "../../infrastructure"
import {SceneStateType} from "../../../engine/state"
import {ObjectStateType} from "../../../engine/state/objectState"

describe('ui', () => {

  test('create ObjectDetails default values', async () => {

    const context = createTestContext([
      new Scene("test 1", context => [
        newObject("model1", context),
        newObject("model2", context),
        newObject("model3", context),
      ])
    ])

    const info = new ObjectDetails()
    context.attachElement(info)

    Verify.model(info, context => new VerifyUIElementContext(context)
      .panelWith("objectDetails", "Object: model1")
    )
  })

  test('create ObjectDetails select object', async () => {

    const context = createTestContext([
      new Scene("test 1", context => [
        newObject("model1", context),
        newObject("model2", context),
        newObject("model3", context),
      ])
    ])

    const sceneState = context.state.get(SceneStateType)
    const objectState = context.state.get(ObjectStateType)
    objectState.setObject(sceneState.objects[1])

    const info = new ObjectDetails()
    context.attachElement(info)

    Verify.model(info, context => new VerifyUIElementContext(context)
      .panelWith("objectDetails", "Object: model2")
    )
  })
})
