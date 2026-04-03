import {UI} from "../../engine/ui"
import {Scene} from "../../engine/scenes"
import {createTestContext} from "./testContext"

describe('ui', () => {
  test('create and attach UI', async () => {
    const context = createTestContext([
      new Scene("test", () => [])
    ])
    const ui = new UI()
    context.attachElement(ui)
  })
})
