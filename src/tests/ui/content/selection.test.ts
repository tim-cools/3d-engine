import {newObject} from "./newObject"
import {createTestContext} from "../testContext"
import {Scene} from "../../../engine/scenes"
import {logElements} from "../getChildrenById"
import {Verify} from "../../infrastructure"
import {VerifyUIElementContext} from "../verifyUIElementContext"
import {Selection} from "../../../engine/ui/content/selection"
import {SelectionListStateType} from "../../../engine/state/selectionListState"
import {Point, PrimitiveSource} from "../../../engine/models"

describe('Selection', () => {

  test('create Selection element', async () => {

    const context = createTestContext([
      new Scene("test 1", context => [
        newObject("model1", context),
        newObject("model2", context),
        newObject("model3", context),
      ])
    ])

    const info = new Selection()
    context.attachElement(info)

    const primitive = new PrimitiveSource(Point.null)
    const selectionListState = context.state.get(SelectionListStateType)
    selectionListState.select(primitive)

    console.log(logElements(info))

    Verify.model(info, context => new VerifyUIElementContext(context)
      .containsRow("Primitive0")
    )
  })
})
