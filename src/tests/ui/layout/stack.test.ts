import {Stack} from "../../../engine/ui/layout"
import {Box} from "../../../engine/ui/controls"
import {ElementSizeValue, fullSize} from "../../../engine/ui/elementSizeValue"
import {ElementArea} from "../../../engine/ui/elementArea"
import {dummyContext} from "./dummyContext"
import {createTestContext} from "../testContext"
import {ElementSize} from "../../../engine/ui/elementSize"
import {Padding} from "../../../engine/ui/padding"
import {verifyArea} from "./verifyArea"

describe('stack', () => {

  test('create and attach', async () => {
    const context = createTestContext()
    const canvas = new Stack()
    context.attachElement(canvas)
  })

  test('empty stack area', async () => {
    const context = createTestContext()
    const stack = new Stack()
    context.attachElement(stack)

    const canvasArea = new ElementArea(0, 0, 100, 100)
    const realArea = stack.render(canvasArea, dummyContext)

    verifyArea(realArea, 0, 0, 100, 100)
  })

  test('discrete height without padding', async () => {
    const context = createTestContext()
    const box = new Box({size: new ElementSize(20, 20)})
    const stack = new Stack({
      padding: Padding.single(0),
      children: [box]
    })
    context.attachElement(stack)

    const canvasArea = new ElementArea(0, 0, 100, 100)
    const realArea = stack.render(canvasArea, dummyContext)

    verifyArea(realArea, 0, 0, 100, 100)
    verifyArea(box.lastArea, 0, 0, 20, 20)
  })

  test('discrete height with padding', async () => {
    const context = createTestContext()
    const box = new Box({size: new ElementSize(20, 20)})
    const stack = new Stack({
      padding: Padding.single(8),
      children: [box]
    })
    context.attachElement(stack)

    const canvasArea = new ElementArea(0, 0, 100, 100)
    const realArea = stack.render(canvasArea, dummyContext)

    verifyArea(realArea, 0, 0, 100, 100)
    verifyArea(box.lastArea, 8, 8, 20, 20)
  })

  test('discrete height without padding full size', async () => {
    const context = createTestContext()
    const box = new Box({size: new ElementSize(fullSize, 20)})
    const stack = new Stack({
      padding: Padding.single(0),
      children: [box]
    })
    context.attachElement(stack)

    const canvasArea = new ElementArea(0, 0, 100, 100)
    const realArea = stack.render(canvasArea, dummyContext)

    verifyArea(realArea, 0, 0, 100, 100)
    verifyArea(box.lastArea, 0, 0, 100, 20)
  })

  test('discrete height with padding full size', async () => {
    const context = createTestContext()
    const box = new Box({size: new ElementSize(fullSize, 20)})
    const stack = new Stack({
      padding: Padding.single(8),
      children: [box]
    })
    context.attachElement(stack)

    const canvasArea = new ElementArea(0, 0, 100, 100)
    const realArea = stack.render(canvasArea, dummyContext)

    verifyArea(realArea, 0, 0, 100, 100)
    verifyArea(box.lastArea, 8, 8, 100 - 16, 20)
  })

  test('discrete height with default null padding', async () => {
    const context = createTestContext()
    const box = new Box({size: new ElementSize(20, 20)})
    const stack = new Stack({
      children: [box]
    })
    context.attachElement(stack)

    const canvasArea = new ElementArea(0, 0, 100, 100)
    const realArea = stack.render(canvasArea, dummyContext)

    verifyArea(realArea, 0, 0, 100, 100)
    verifyArea(box.lastArea, 0, 0, 20, 20)
  })

  test('discrete height with default null padding full size', async () => {
    const context = createTestContext()
    const box = new Box({size: new ElementSize(fullSize, 20)})
    const stack = new Stack({
      padding: Padding.single(8),
      children: [box]
    })
    context.attachElement(stack)

    const canvasArea = new ElementArea(0, 0, 100, 100)
    const realArea = stack.render(canvasArea, dummyContext)

    verifyArea(realArea, 0, 0, 100, 100)
    verifyArea(box.lastArea, 8, 8, 100 - 16, 20)
  })

  test('discrete height and full height with default null padding default spacing', async () => {
    const context = createTestContext()
    const box = new Box({size: new ElementSize(fullSize, 20)})
    const box2 = new Box({size: new ElementSize(fullSize, fullSize)})
    const stack = new Stack({
      children: [box, box2]
    })
    context.attachElement(stack)

    const canvasArea = new ElementArea(0, 0, 100, 100)
    const realArea = stack.render(canvasArea, dummyContext)

    verifyArea(realArea, 0, 0, 100, 100)
    verifyArea(box.lastArea, 0, 0, 100, 20)
    verifyArea(box2.lastArea, 0, 24, 100, 100 - 20 - 4)
  })

  test('discrete height and full height with default null padding full size default spacing', async () => {
    const context = createTestContext()
    const box = new Box({size: new ElementSize(fullSize, 20)})
    const box2 = new Box({size: new ElementSize(fullSize, fullSize)})
    const stack = new Stack({
      padding: Padding.single(8),
      children: [box, box2]
    })
    context.attachElement(stack)

    const canvasArea = new ElementArea(0, 0, 100, 100)
    const realArea = stack.render(canvasArea, dummyContext)

    verifyArea(realArea, 0, 0, 100, 100)
    verifyArea(box.lastArea, 8, 8, 100 - 16, 20)
    verifyArea(box2.lastArea, 8, 32, 84, 100 - 20 - 16 - 4)
  })

  test('discrete height and full height with default null padding custom spacing', async () => {
    const context = createTestContext()
    const box = new Box({size: new ElementSize(fullSize, 20)})
    const box2 = new Box({size: new ElementSize(fullSize, fullSize)})
    const stack = new Stack({
      children: [box, box2],
      spacing: 16
    })
    context.attachElement(stack)

    const canvasArea = new ElementArea(0, 0, 100, 100)
    const realArea = stack.render(canvasArea, dummyContext)

    verifyArea(realArea, 0, 0, 100, 100)
    verifyArea(box.lastArea, 0, 0, 100, 20)
    verifyArea(box2.lastArea, 0, 36, 100, 64)
  })

  test('discrete height and full height with default null padding full size custom spacing', async () => {
    const context = createTestContext()
    const box = new Box({size: new ElementSize(fullSize, 20)})
    const box2 = new Box({size: new ElementSize(fullSize, fullSize)})
    const stack = new Stack({
      padding: Padding.single(8),
      children: [box, box2],
      spacing: 16
    })
    context.attachElement(stack)

    const canvasArea = new ElementArea(0, 0, 100, 100)
    const realArea = stack.render(canvasArea, dummyContext)

    verifyArea(realArea, 0, 0, 100, 100)
    verifyArea(box.lastArea, 8, 8, 100 - 16, 20)
    verifyArea(box2.lastArea, 8, 44, 84, 100 - 16 - 16 - 20)
  })

  test('multiple children custom spacing should add all spacing to height', async () => {
    const context = createTestContext()
    const stack = new Stack({
      padding: Padding.single(8),
      children: [
        new Box({size: new ElementSize(fullSize, 20)}),
        new Box({size: new ElementSize(fullSize, 20)}),
        new Box({size: new ElementSize(fullSize, 20)}),
        new Box({size: new ElementSize(fullSize, 20)}),
        new Box({size: new ElementSize(fullSize, 20)})
      ],
      spacing: 16
    })
    context.attachElement(stack)

    const stackSize = stack.calculateSize()
    expect(stackSize.height.proportion).toBeFalsy()

    const renderArea = new ElementArea(0, 0, 100, stackSize.height.value)
    const realArea = stack.render(renderArea, dummyContext)

    verifyArea(realArea, 0, 0, 100, (2 * 8) + (5 * 20) + (4 * 16))
  })
})
