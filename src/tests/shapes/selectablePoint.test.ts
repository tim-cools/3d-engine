import {Point2D, PrimitiveSource} from "../../engine/models"
import {SelectablePoint} from "../../engine/shapes/selectablePoint"

type AssertInclude = {x: number, y: number, result: boolean}

describe('selectable point', () => {

  const point = new Point2D(3, 3)

  it.each([
    { x: 2, y: 2, result: true },
    { x: 2, y: 3, result: true },
    { x: 3, y: 3, result: true },
    { x: 3, y: 2, result: true },
    { x: 4, y: 3, result: true },
    { x: 4, y: 4, result: true },

    { x: 1, y: 1, result: false },
    { x: 5, y: 5, result: false },

    { x: 1, y: 3, result: false },
    { x: 3, y: 1, result: false },

    { x: 4, y: 5, result: false },
    { x: 2, y: 1, result: false },
  ])("include point '%s'", verifyInclude);

  function verifyInclude(assert: AssertInclude) {
    const source = new PrimitiveSource(point.to3D(), "model")
    const selectable = new SelectablePoint(source, point, 1)
    const point2D = new Point2D(assert.x, assert.y)
    const result = selectable.includes(point2D)
    expect(result).toBe(assert.result)
  }
})
