import {newObject} from "./newObject"
import {createTestContext} from "../testContext"
import {Scene} from "../../../engine/scenes"
import {ObjectsList} from "../../../engine/ui/content/objectsList"
import {logElements} from "../getChildrenById"
import {Verify} from "../../infrastructure"
import {VerifyUIElementContext} from "../verifyUIElementContext"

describe('ObjectList', () => {

  test('create ObjectList default values', async () => {

    const context = createTestContext([
      new Scene("test 1", context => [
        newObject("model1", context),
        newObject("model2", context),
        newObject("model3", context),
      ])
    ])

    const info = new ObjectsList()
    context.attachElement(info)

    console.log(logElements(info))

    Verify.model(info, context => new VerifyUIElementContext(context)
      .linkWith("Row0.Link", "model1")
      .linkWith("Row1.Link", "model2")
      .linkWith("Row2.Link", "model3")
    )
  })
})
