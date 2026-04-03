import {Row} from "../../../engine/ui/layout"
import {Box} from "../../../engine/ui/controls"
import {fullSize} from "../../../engine/ui/elementSizeValue"
import {ElementArea} from "../../../engine/ui/elementArea"
import {dummyContext} from "./dummyContext"
import {createTestContext} from "../testContext"
import {ElementSize} from "../../../engine/ui/elementSize"
import {Padding} from "../../../engine/ui/padding"
import {verifyArea} from "./verifyArea"

describe('row', () => {

  test('create and attach', async () => {
    const context = createTestContext()
    const canvas = new Row()
    context.attachElement(canvas)
  })

  test('empty row area', async () => {
    const context = createTestContext()
    const row = new Row()
    context.attachElement(row)

    const canvasArea = new ElementArea(0, 0, 100, 100)
    const realArea = row.render(canvasArea, dummyContext)

    verifyArea(realArea, 0, 0, 100, 100)
  })

  test('discrete height without padding', async () => {
    const context = createTestContext()
    const box = new Box({size: new ElementSize(20, 20)})
    const row = new Row({
      padding: Padding.single(0),
      children: [box]
    })
    context.attachElement(row)

    const canvasArea = new ElementArea(0, 0, 100, 100)
    const realArea = row.render(canvasArea, dummyContext)

    verifyArea(realArea, 0, 0, 100, 100)
    verifyArea(box.lastArea, 0, 0, 20, 20)
  })

  test('discrete height with padding', async () => {
    const context = createTestContext()
    const box = new Box({size: new ElementSize(20, 20)})
    const row = new Row({
      padding: Padding.single(8),
      children: [box]
    })
    context.attachElement(row)

    const canvasArea = new ElementArea(0, 0, 100, 100)
    const realArea = row.render(canvasArea, dummyContext)

    verifyArea(realArea, 0, 0, 100, 100)
    verifyArea(box.lastArea, 8, 8, 20, 20)
  })

  test('discrete height without padding full size', async () => {
    const context = createTestContext()
    const box = new Box({size: new ElementSize(20, fullSize)})
    const row = new Row({
      padding: Padding.single(0),
      children: [box]
    })
    context.attachElement(row)

    const canvasArea = new ElementArea(0, 0, 100, 100)
    const realArea = row.render(canvasArea, dummyContext)

    verifyArea(realArea, 0, 0, 100, 100)
    verifyArea(box.lastArea, 0, 0, 20, 100)
  })

  test('discrete height with padding full size', async () => {
    const context = createTestContext()
    const box = new Box({size: new ElementSize(20, fullSize)})
    const row = new Row({
      padding: Padding.single(8),
      children: [box]
    })
    context.attachElement(row)

    const canvasArea = new ElementArea(0, 0, 100, 100)
    const realArea = row.render(canvasArea, dummyContext)

    verifyArea(realArea, 0, 0, 100, 100)
    verifyArea(box.lastArea, 8, 8, 20, 100 - 16)
  })

  test('discrete height with default null padding', async () => {
    const context = createTestContext()
    const box = new Box({size: new ElementSize(20, 20)})
    const row = new Row({
      children: [box]
    })
    context.attachElement(row)

    const canvasArea = new ElementArea(0, 0, 100, 100)
    const realArea = row.render(canvasArea, dummyContext)

    verifyArea(realArea, 0, 0, 100, 100)
    verifyArea(box.lastArea, 0, 0, 20, 20)
  })

  test('discrete height with default null padding full size', async () => {
    const context = createTestContext()
    const box = new Box({size: new ElementSize(20, fullSize)})
    const row = new Row({
      padding: Padding.single(8),
      children: [box]
    })
    context.attachElement(row)

    const canvasArea = new ElementArea(0, 0, 100, 100)
    const realArea = row.render(canvasArea, dummyContext)

    verifyArea(realArea, 0, 0, 100, 100)
    verifyArea(box.lastArea, 8, 8, 20, 100 - 16)
  })

  test('discrete height and full height with default null padding default spacing', async () => {
    const context = createTestContext()
    const box = new Box({size: new ElementSize(20, fullSize)})
    const box2 = new Box({size: new ElementSize(fullSize, fullSize)})
    const row = new Row({
      children: [box, box2]
    })
    context.attachElement(row)

    const canvasArea = new ElementArea(0, 0, 100, 100)
    const realArea = row.render(canvasArea, dummyContext)

    verifyArea(realArea, 0, 0, 100, 100)
    verifyArea(box.lastArea, 0, 0, 20, 100)
    verifyArea(box2.lastArea, 24, 0, 100 - 20 - 4, 100)
  })

  test('discrete height and full height with default null padding full size default spacing', async () => {
    const context = createTestContext()
    const box = new Box({size: new ElementSize(20, fullSize)})
    const box2 = new Box({size: new ElementSize(fullSize, fullSize)})
    const row = new Row({
      padding: Padding.single(8),
      children: [box, box2]
    })
    context.attachElement(row)

    const canvasArea = new ElementArea(0, 0, 100, 100)
    const realArea = row.render(canvasArea, dummyContext)

    verifyArea(realArea, 0, 0, 100, 100)
    verifyArea(box.lastArea, 8, 8, 20, 100 - 16)
    verifyArea(box2.lastArea, 32, 8, 100 - 20 - 16 - 4, 84)
  })

  test('discrete height and full height with default null padding custom spacing', async () => {
    const context = createTestContext()
    const box = new Box({size: new ElementSize(20, fullSize)})
    const box2 = new Box({size: new ElementSize(fullSize, fullSize)})
    const row = new Row({
      children: [box, box2],
      spacing: 16
    })
    context.attachElement(row)

    const canvasArea = new ElementArea(0, 0, 100, 100)
    const realArea = row.render(canvasArea, dummyContext)

    verifyArea(realArea, 0, 0, 100, 100)
    verifyArea(box.lastArea, 0, 0, 20, 100)
    verifyArea(box2.lastArea, 36, 0, 64, 100)
  })

  test('discrete height and full height with default null padding full size custom spacing', async () => {
    const context = createTestContext()
    const box = new Box({size: new ElementSize(20, fullSize)})
    const box2 = new Box({size: new ElementSize(fullSize, fullSize)})
    const row = new Row({
      padding: Padding.single(8),
      children: [box, box2],
      spacing: 16
    })
    context.attachElement(row)

    const canvasArea = new ElementArea(0, 0, 100, 100)
    const realArea = row.render(canvasArea, dummyContext)

    verifyArea(realArea, 0, 0, 100, 100)
    verifyArea(box.lastArea, 8, 8, 20, 100 - 16)
    verifyArea(box2.lastArea, 44, 8, 100 - 16 - 16 - 20, 84)
  })

  test('multiple children custom spacing should add all spacing to height', async () => {
    const context = createTestContext()
    const row = new Row({
      padding: Padding.single(8),
      children: [
        new Box({size: new ElementSize(20, fullSize)}),
        new Box({size: new ElementSize(20, fullSize)}),
        new Box({size: new ElementSize(20, fullSize)}),
        new Box({size: new ElementSize(20, fullSize)}),
        new Box({size: new ElementSize(20, fullSize)})
      ],
      spacing: 16
    })
    context.attachElement(row)

    const rowSize = row.calculateSize()
    expect(rowSize.width.proportion).toBeFalsy()

    const renderArea = new ElementArea(0, 0, rowSize.width.value, 100)
    const realArea = row.render(renderArea, dummyContext)

    verifyArea(realArea, 0, 0, (2 * 8) + (5 * 20) + (4 * 16), 100)
  })
})
