import {Context} from "../../../engine/context"
import {Scene} from "../../../engine/scenes"
import {Canvas} from "../../../engine/ui/layout/canvas"
import {IconButton} from "../../../engine/ui/controls/iconButton"
import {Icon} from "../../../engine/ui/rendering/icons"
import {ElementSizeValue} from "../../../engine/ui/elementSizeValue"
import {ElementArea} from "../../../engine/ui/elementArea"
import {Verify} from "../../infrastructure"
import {dummyContext} from "./dummyContext"
import {AttachmentProperty} from "../../../engine/ui/attachmentProperty"

function verifyCanvasAnchors(attach: AttachmentProperty[]) {
  const context = new Context([
    new Scene("test", () => [])
  ])

  const iconButton = new IconButton({
    icon: Icon.Loop,
    size: new ElementSizeValue(20),
    attach: attach
  })

  const canvas = new Canvas({elements: [iconButton]})
  context.attachElement(canvas)

  canvas.render(new ElementArea(50, 50, 200, 200), dummyContext)
  return iconButton.lastArea
}

describe('canvas with top and left area', () => {

  test('create and attach canvas', async () => {
    const context = new Context([
      new Scene("test", () => [])
    ])
    const canvas = new Canvas()
    context.attachElement(canvas)
  })

  test('left top element', async () => {

    const elementArea = verifyCanvasAnchors([
      Canvas.left(10),
      Canvas.top(10),
    ])

    Verify.model(elementArea, context => context
      .areEqual(area => area.top, 60)
      .areEqual(area => area.left, 60)
      .areEqual(area => area.width, 20)
      .areEqual(area => area.height, 20)
    )
  })

  test('left bottom element', async () => {

    const elementArea = verifyCanvasAnchors([
      Canvas.left(10),
      Canvas.bottom(10),
    ])

    Verify.model(elementArea, context => context
      .areEqual(area => area.top, 220)
      .areEqual(area => area.left, 60)
      .areEqual(area => area.width, 20)
      .areEqual(area => area.height, 20)
    )
  })

  test('right top element', async () => {

    const elementArea = verifyCanvasAnchors([
      Canvas.right(10),
      Canvas.top(10),
    ])

    Verify.model(elementArea, context => context
      .areEqual(area => area.top, 60)
      .areEqual(area => area.left, 220)
      .areEqual(area => area.width, 20)
      .areEqual(area => area.height, 20)
    )
  })

  test('right bottom element', async () => {

    const elementArea = verifyCanvasAnchors([
      Canvas.right(10),
      Canvas.bottom(10),
    ])

    Verify.model(elementArea, context => context
      .areEqual(area => area.top, 220)
      .areEqual(area => area.left, 220)
      .areEqual(area => area.width, 20)
      .areEqual(area => area.height, 20)
    )
  })

  test('left element', async () => {

    const elementArea = verifyCanvasAnchors([
      Canvas.left(10)
    ])

    Verify.model(elementArea, context => context
      .areEqual(area => area.top, 50)
      .areEqual(area => area.left, 60)
      .areEqual(area => area.width, 20)
      .areEqual(area => area.height, 20)
    )
  })

  test('right element', async () => {

    const elementArea = verifyCanvasAnchors([
      Canvas.right(10)
    ])

    Verify.model(elementArea, context => context
      .areEqual(area => area.top, 50)
      .areEqual(area => area.left, 220)
      .areEqual(area => area.width, 20)
      .areEqual(area => area.height, 20)
    )
  })

  test('top element', async () => {

    const elementArea = verifyCanvasAnchors([
      Canvas.top(10)
    ])

    Verify.model(elementArea, context => context
      .areEqual(area => area.top, 60)
      .areEqual(area => area.left, 50)
      .areEqual(area => area.width, 20)
      .areEqual(area => area.height, 20)
    )
  })

  test('bottom element', async () => {

    const elementArea = verifyCanvasAnchors([
      Canvas.bottom(10),
    ])

    Verify.model(elementArea, context => context
      .areEqual(area => area.top, 220)
      .areEqual(area => area.left, 50)
      .areEqual(area => area.width, 20)
      .areEqual(area => area.height, 20)
    )
  })
})
