import {Point2D, PrimitiveSource, Segment} from "../../engine/models"
import {SelectableSegment} from "../../engine/shapes/selectableSegment"

type AssertInclude = {x: number, y: number, result: boolean}

function verifyInclude(begin: Point2D, end: Point2D) {
  return function verifyInclude(assert: AssertInclude) {
    const source = new PrimitiveSource(new Segment(begin.to3D(), end.to3D()), "test")
    const selectable = new SelectableSegment(source, begin, end, 1)
    const point2D = new Point2D(assert.x, assert.y)
    const result = selectable.includes(point2D)
    expect(result).toBe(assert.result)
  }
}

describe('selectable line (Horizontal)', () => {

  const begin = new Point2D(3, 3)
  const end = new Point2D(7, 3)

  it.each([
    { x: 2, y: 3, result: true },
    { x: 3, y: 3, result: true },
    { x: 3, y: 3, result: true },
    { x: 5, y: 3, result: true },
    { x: 6, y: 3, result: true },
    { x: 7, y: 3, result: true },
    { x: 8, y: 3, result: true },

    { x: 2, y: 2, result: true },
    { x: 3, y: 4, result: true },
    { x: 3, y: 4, result: true },
    { x: 5, y: 2, result: true },
    { x: 6, y: 2, result: true },
    { x: 7, y: 4, result: true },
    { x: 8, y: 4, result: true },

    { x: 2, y: 1, result: false },
    { x: 3, y: 5, result: false },
    { x: 8, y: 5, result: false },
    { x: 1, y: 2, result: false },
    { x: 9, y: 3, result: false },
  ])("include line '%s'", verifyInclude(begin, end));
})

describe('selectable line (Vertical)', () => {

  const begin = new Point2D(3, 3)
  const end = new Point2D(3, 7)

  it.each([
    { x: 3, y: 2, result: true },
    { x: 3, y: 3, result: true },
    { x: 3, y: 3, result: true },
    { x: 3, y: 5, result: true },
    { x: 3, y: 6, result: true },
    { x: 3, y: 7, result: true },
    { x: 3, y: 8, result: true },

    { x: 2, y: 2, result: true },
    { x: 4, y: 3, result: true },
    { x: 4, y: 3, result: true },
    { x: 2, y: 5, result: true },
    { x: 2, y: 6, result: true },
    { x: 4, y: 7, result: true },
    { x: 4, y: 8, result: true },

    { x: 1, y: 2, result: false },
    { x: 5, y: 3, result: false },
    { x: 5, y: 8, result: false },
    { x: 2, y: 1, result: false },
    { x: 3, y: 9, result: false },
  ])("include line '%s'", verifyInclude(begin, end));
})

describe('selectable line (Top Left - Bottom Right)', () => {

  const begin = new Point2D(3, 3)
  const end = new Point2D(7, 7)

  it.each([
    { x: 2, y: 2, result: true },
    { x: 3, y: 3, result: true },
    { x: 4, y: 4, result: true },
    { x: 5, y: 5, result: true },
    { x: 6, y: 6, result: true },
    { x: 7, y: 7, result: true },
    { x: 8, y: 8, result: true },

    { x: 2, y: 3, result: true },
    { x: 3, y: 2, result: true },
    { x: 4, y: 5, result: true },
    { x: 5, y: 6, result: true },
    { x: 6, y: 7, result: true },
    { x: 6, y: 5, result: true },
    { x: 7, y: 8, result: true },
    { x: 8, y: 7, result: true },

    { x: 1, y: 1, result: false },
    { x: 3, y: 5, result: false },
    { x: 4, y: 6, result: false },
    { x: 7, y: 5, result: false },
    { x: 3, y: 6, result: false },
    { x: 9, y: 7, result: false },
    { x: 9, y: 9, result: false },
  ])("include line '%s'", verifyInclude(begin, end))
})

describe('selectable line (Bottom Right - Top Left)', () => {

  const begin = new Point2D(7, 7)
  const end = new Point2D(3, 3)

  it.each([
    { x: 2, y: 2, result: true },
    { x: 3, y: 3, result: true },
    { x: 4, y: 4, result: true },
    { x: 5, y: 5, result: true },
    { x: 6, y: 6, result: true },
    { x: 7, y: 7, result: true },
    { x: 8, y: 8, result: true },

    { x: 2, y: 3, result: true },
    { x: 3, y: 2, result: true },
    { x: 4, y: 5, result: true },
    { x: 5, y: 6, result: true },
    { x: 6, y: 7, result: true },
    { x: 6, y: 5, result: true },
    { x: 7, y: 8, result: true },
    { x: 8, y: 7, result: true },

    { x: 1, y: 1, result: false },
    { x: 3, y: 5, result: false },
    { x: 4, y: 6, result: false },
    { x: 7, y: 5, result: false },
    { x: 3, y: 6, result: false },
    { x: 9, y: 7, result: false },
    { x: 9, y: 9, result: false },
  ])("include line '%s'", verifyInclude(begin, end))
})
