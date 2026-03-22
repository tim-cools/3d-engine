import {Point2D} from "../../engine/models"
import {SelectablePath} from "../../engine/shapes/selectablePath"

type AssertInclude = {x: number, y: number, result: boolean}

describe('selectable path', () => {

  const points = [
    new Point2D(2, 2),
    new Point2D(2, 3),
    new Point2D(7, 8),
    new Point2D(8, 8),
    new Point2D(8, 7),
    new Point2D(3, 2),
  ]

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
  ])("include point '%s'", verifyInclude);

  function verifyInclude(assert: AssertInclude) {
    const selectable = new SelectablePath("id", points, true)
    const point2D = new Point2D(assert.x, assert.y)
    const result = selectable.includes(point2D)
    expect(result).toBe(assert.result)
  }
})
