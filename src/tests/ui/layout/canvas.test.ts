import {Context} from "../../../engine/context"
import {Scene} from "../../../engine/scenes"
import {Canvas} from "../../../engine/ui/layout"
import {IconButton} from "../../../engine/ui/controls"
import {Icon} from "../../../engine/ui/rendering/icons"
import {ElementSizeValue} from "../../../engine/ui/elementSizeValue"
import {ElementArea} from "../../../engine/ui/elementArea"
import {Verify} from "../../infrastructure"
import {dummyContext} from "./dummyContext"
import {AttachmentProperty} from "../../../engine/ui/attachmentProperty"
import {createTestContext} from "../testContext"

function verifyCanvasAnchors(attach: AttachmentProperty[]) {
  const context = createTestContext([
    new Scene("test", () => [])
  ])

  const iconButton = new IconButton({
    icon: Icon.Loop,
    size: new ElementSizeValue(20),
    attach: attach
  })

  const canvas = new Canvas({elements: [iconButton]})
  context.attachElement(canvas)

  canvas.render(ElementArea.square(100), dummyContext)
  return iconButton.lastArea
}

describe('canvas', () => {

  test('create and attach canvas', async () => {
    const context = createTestContext([
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
      .areEqual(area => area.top, 10)
      .areEqual(area => area.left, 10)
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
      .areEqual(area => area.top, 70)
      .areEqual(area => area.left, 10)
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
      .areEqual(area => area.top, 10)
      .areEqual(area => area.left, 70)
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
      .areEqual(area => area.top, 70)
      .areEqual(area => area.left, 70)
      .areEqual(area => area.width, 20)
      .areEqual(area => area.height, 20)
    )
  })

  test('left element', async () => {

    const elementArea = verifyCanvasAnchors([
      Canvas.left(10)
    ])

    Verify.model(elementArea, context => context
      .areEqual(area => area.top, 0)
      .areEqual(area => area.left, 10)
      .areEqual(area => area.width, 20)
      .areEqual(area => area.height, 20)
    )
  })

  test('right element', async () => {

    const elementArea = verifyCanvasAnchors([
      Canvas.right(10)
    ])

    Verify.model(elementArea, context => context
      .areEqual(area => area.top, 0)
      .areEqual(area => area.left, 70)
      .areEqual(area => area.width, 20)
      .areEqual(area => area.height, 20)
    )
  })

  test('top element', async () => {

    const elementArea = verifyCanvasAnchors([
      Canvas.top(10)
    ])

    Verify.model(elementArea, context => context
      .areEqual(area => area.top, 10)
      .areEqual(area => area.left, 0)
      .areEqual(area => area.width, 20)
      .areEqual(area => area.height, 20)
    )
  })

  test('bottom element', async () => {

    const elementArea = verifyCanvasAnchors([
      Canvas.bottom(10),
    ])

    Verify.model(elementArea, context => context
      .areEqual(area => area.top, 70)
      .areEqual(area => area.left, 0)
      .areEqual(area => area.width, 20)
      .areEqual(area => area.height, 20)
    )
  })

  const unsupportedCases: any[] = [
    {attach: [Canvas.left(10), Canvas.right(10), Canvas.bottom (10)]},
    {attach: [Canvas.left(10), Canvas.right(10), Canvas.top (10)]},
    {attach: [Canvas.left(10), Canvas.bottom(10), Canvas.top (10)]},
    {attach: [Canvas.right(10), Canvas.bottom(10), Canvas.top (10)]},
    {attach: [Canvas.left(10), Canvas.right(10), Canvas.top (10), Canvas.bottom(10)]}
  ]

  it.each(unsupportedCases)("anchors not implements", verify)

  function verify(properties: {attach: AttachmentProperty[]}) {
    expect(() => verifyCanvasAnchors(properties.attach)).toThrow("Invalid anchors: ")
  }
})
