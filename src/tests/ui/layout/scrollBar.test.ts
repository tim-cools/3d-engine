import {ElementArea} from "../../../engine/ui/elementArea"
import {createTestContext} from "../testContext"
import {verifyArea} from "./verifyArea"
import {ScrollBar} from "../../../engine/ui/layout/scrollBar"

function testScrollbar(contentTop: number, contentHeight: number, visibleHeight: number) {
  const context = createTestContext()
  const scrollBar = new ScrollBar()
  scrollBar.contentTop = contentTop
  scrollBar.contentHeight = contentHeight
  scrollBar.visibleHeight = visibleHeight
  context.attachElement(scrollBar)
  return scrollBar
}

describe('scrollBar', () => {

  test('create and attach', async () => {
    testScrollbar(0, 50, 100)
  })

  test('empty content', async () => {
    const scrollBar = testScrollbar(0, 0, 100)
    const sliderArea = scrollBar.calculateSliderArea(new ElementArea(0, 0, 10, 100))

    verifyArea(sliderArea, 0, 0, 10, 100)
  })

  test('half content height', async () => {
    const scrollBar = testScrollbar(0, 50, 100)
    const sliderArea = scrollBar.calculateSliderArea(new ElementArea(0, 0, 10, 100))

    verifyArea(sliderArea, 0, 0, 10, 100)
  })

  test('full content height', async () => {
    const scrollBar = testScrollbar(0, 100, 100)
    const sliderArea = scrollBar.calculateSliderArea(new ElementArea(0, 0, 10, 100))

    verifyArea(sliderArea, 0, 0, 10, 100)
  })

  test('double content height', async () => {
    const scrollBar = testScrollbar(0, 200, 100)
    const sliderArea = scrollBar.calculateSliderArea(new ElementArea(0, 0, 10, 100))

    verifyArea(sliderArea, 0, 0, 10, 50)
  })

  test('double content height 25% top', async () => {
    const scrollBar = testScrollbar(25, 200, 100)
    const sliderArea = scrollBar.calculateSliderArea(new ElementArea(0, 0, 10, 100))

    verifyArea(sliderArea, 0, 12.5, 10, 50)
  })

  test('double content height 50% top', async () => {
    const scrollBar = testScrollbar(50, 200, 100)
    const sliderArea = scrollBar.calculateSliderArea(new ElementArea(0, 0, 10, 100))

    verifyArea(sliderArea, 0, 25, 10, 50)
  })

  test('double content height 75% top', async () => {
    const scrollBar = testScrollbar(75, 200, 100)
    const sliderArea = scrollBar.calculateSliderArea(new ElementArea(0, 0, 10, 100))

    verifyArea(sliderArea, 0, 37.5, 10, 50)
  })

  test('double content height 100% top', async () => {
    const scrollBar = testScrollbar(100, 200, 100)
    const sliderArea = scrollBar.calculateSliderArea(new ElementArea(0, 0, 10, 100))

    verifyArea(sliderArea, 0, 50, 10, 50)
  })

  test('double content height 100%> top', async () => {
    const scrollBar = testScrollbar(110, 200, 100)
    const sliderArea = scrollBar.calculateSliderArea(new ElementArea(0, 0, 10, 100))

    verifyArea(sliderArea, 0, 50, 10, 50)
  })

  test('half content height 150 top <0', async () => {
    const scrollBar = testScrollbar(-5, 50, 150)
    const sliderArea = scrollBar.calculateSliderArea(new ElementArea(0, 0, 10, 100))

    verifyArea(sliderArea, 0, 0, 10, 100)
  })

  test('half content height 150', async () => {
    const scrollBar = testScrollbar(0, 50, 150)
    const sliderArea = scrollBar.calculateSliderArea(new ElementArea(0, 0, 10, 100))

    verifyArea(sliderArea, 0, 0, 10, 100)
  })

  test('full content height 150', async () => {
    const scrollBar = testScrollbar(0, 100, 150)
    const sliderArea = scrollBar.calculateSliderArea(new ElementArea(0, 0, 10, 100))

    verifyArea(sliderArea, 0, 0, 10, 100)
  })

  test('double content height 150', async () => {
    const scrollBar = testScrollbar(0, 200, 150)
    const sliderArea = scrollBar.calculateSliderArea(new ElementArea(0, 0, 10, 100))

    verifyArea(sliderArea, 0, 0, 10, 75)
  })

  test('double content height 150 25% top', async () => {
    const scrollBar = testScrollbar(12.5, 200,  150)
    const sliderArea = scrollBar.calculateSliderArea(new ElementArea(0, 0, 10, 100))

    verifyArea(sliderArea, 0, 6.25, 10, 75)
  })

  test('double content height 150 50% top', async () => {
    const scrollBar = testScrollbar(25, 200, 150)
    const sliderArea = scrollBar.calculateSliderArea(new ElementArea(0, 0, 10, 100))

    verifyArea(sliderArea, 0, 12.5, 10, 75)
  })

  test('double content height 150 75% top', async () => {
    const scrollBar = testScrollbar(37.5, 200, 150)
    const sliderArea = scrollBar.calculateSliderArea(new ElementArea(0, 0, 10, 100))

    verifyArea(sliderArea, 0, 18.75, 10, 75)
  })

  test('double content height 150 100% top', async () => {
    const scrollBar = testScrollbar(50, 200,  150)
    const sliderArea = scrollBar.calculateSliderArea(new ElementArea(0, 0, 10, 100))

    verifyArea(sliderArea, 0, 25, 10, 75)
  })

  test('offset position empty content', async () => {
    const scrollBar = testScrollbar(0, 0, 100)
    const sliderArea = scrollBar.calculateSliderArea(new ElementArea(25, 25, 10, 100))

    verifyArea(sliderArea, 25, 25, 10, 100)
  })

  test('height 100 apply y offset', async () => {
    const scrollBar = testScrollbar(0, 200, 100)
    scrollBar.applyOffset(5, new ElementArea(0, 0, 10, 100))

    expect(scrollBar.contentTop).toBe(10)
  })

  test('height 100 apply y offset twice', async () => {
    const scrollBar = testScrollbar(0, 200, 100)
    const elementArea = new ElementArea(0, 0, 10, 100)
    scrollBar.applyOffset(5, elementArea)
    scrollBar.applyOffset(5, elementArea)

    expect(scrollBar.contentTop).toBe(20)
  })

  test('height 150 apply y half offset', async () => {
    const scrollBar = testScrollbar(0, 200, 150)
    scrollBar.applyOffset(12.5, new ElementArea(0, 0, 10, 100))

    expect(scrollBar.contentTop).toBe(25)
  })

  test('height 150 apply y full offset', async () => {
    const scrollBar = testScrollbar(0, 200, 150)
    scrollBar.applyOffset(25, new ElementArea(0, 0, 10, 100))

    expect(scrollBar.contentTop).toBe(50)
  })

  test('height 150 apply y offset overflow', async () => {
    const scrollBar = testScrollbar(0, 200, 150)
    scrollBar.applyOffset(100, new ElementArea(0, 0, 10, 100))

    expect(scrollBar.contentTop).toBe(50)
  })
})
