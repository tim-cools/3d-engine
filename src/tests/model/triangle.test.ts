import {Point, Segment, Triangle} from "../../engine/models"

describe('triangle', () => {

  test('has segment', async () => {

    const triangle = new Triangle(new Point(3, 2, 0), new Point(7, 8, 0), new Point(8, 8, 0))
    const segment = new Segment(new Point(7, 8.000000000000001, 0), new Point(3, 2, 0))

    const result = triangle.hasSegment(segment)

    expect(result).toBe(true)
  })
})
