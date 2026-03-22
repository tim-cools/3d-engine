import {Ray, Segment, Triangle, Vector} from "../../engine/models"
import {Point} from "../../engine/models"
import {equalsTolerancePoint} from "../../engine/models/equals"
import {intersectionTriangleRay} from "../../engine/intersections/intersectionTriangleRay"
import {IntersectionType} from "../../engine/intersections/intersectionResult"

describe("triangle ray intersection", () => {

  test('none', async () => {
    const vector = Vector.fromPoints(new Point(2, 2, -1), new Point(2, 2, 1))
    const ray = new Ray(new Point(2, 2, -1), vector)
    const triangle = new Triangle(
      new Point(0, 0, 0),
      new Point(0, 2, 0),
      new Point(2, 0, 0))

    const intersection = intersectionTriangleRay(triangle, ray)

    expect(intersection.type).toBe(IntersectionType.None)
  })

  test('straight', async () => {
    const vector = Vector.fromPoints(new Point(1, 1, -1), new Point(1, 1, 1))
    const ray = new Ray(new Point(1, 1, -1), vector)
    const triangle = new Triangle(
      new Point(0, 0, 0),
      new Point(0, 2, 0),
      new Point(2, 0, 0))

    const intersection = intersectionTriangleRay(triangle, ray)

    if (intersection.type != IntersectionType.Point) throw new Error("intersection.type != IntersectionType.Point: " + IntersectionType[intersection.type])
    expect(intersection.point).toEqual(new Point(1, 1, 0))
  })

  test('skewed triangle', async () => {
    const vector = Vector.fromPoints(new Point(1, 1, -1), new Point(1, 1, 1))
    const ray = new Ray(new Point(1, 1, -1), vector)
    const triangle = new Triangle(
      new Point(0, 0, 1),
      new Point(0, 2, -1),
      new Point(2, 0, 0))

    const intersection = intersectionTriangleRay(triangle, ray)

    if (intersection.type != IntersectionType.Point) throw new Error("intersection.type != IntersectionType.Point: " + IntersectionType[intersection.type])
    expect(equalsTolerancePoint(intersection.point, new Point(1, 1, -0.5))).toBeTruthy()
  })

  test('skewed line', async () => {
    const vector = Vector.fromPoints(new Point(.7, 0.6, -1), new Point(1, 1, 1))
    const ray = new Ray(new Point(.7, 0.6, -1), vector)
    const triangle = new Triangle(
      new Point(0, 0, 0),
      new Point(0, 2, 0),
      new Point(2, 0, 0))

    const intersection = intersectionTriangleRay(triangle, ray)

    if (intersection.type != IntersectionType.Point) throw new Error("intersection.type != IntersectionType.Point: " + IntersectionType[intersection.type])
    expect(intersection.point).toEqual(new Point(0.85, 0.8, 0))
  })

  test('skewed', async () => {
    const vector = Vector.fromPoints(new Point(.7, 0.6, -1), new Point(1, 1, 1))
    const ray = new Ray(new Point(.7, 0.6, -1), vector)
    const triangle = new Triangle(
      new Point(0, 0, 1),
      new Point(0, 2, -1),
      new Point(2, 0, 0))

    const intersection = intersectionTriangleRay(triangle, ray)

    const expected = new Point(0.82352941176470584, 0.76470588235294112, -0.17647058823529405)

    if (intersection.type != IntersectionType.Point) throw new Error("intersection.type != IntersectionType.Point: " + IntersectionType[intersection.type])
    expect(equalsTolerancePoint(intersection.point, expected)).toBeTruthy()
  })

  test('segment', async () => {
    const vector = Vector.fromPoints(new Point(0, 0, 0), new Point(1, 1, 0))
    const ray = new Ray(new Point(0, 0, 0), vector)
    const triangle = new Triangle(
      new Point(0, 0, 0),
      new Point(0, 2, 0),
      new Point(2, 0, 0))

    const intersection = intersectionTriangleRay(triangle, ray)

    if (intersection.type != IntersectionType.Segment) throw new Error("intersection.type != IntersectionType.Segment: " + IntersectionType[intersection.type])
    expect(intersection.segment).toEqual(new Segment(
      new Point(0, 0, 0),
      new Point(1, 1, 0)))
  })

  test('segment partial', async () => {
    const vector = Vector.fromPoints(new Point(-1, 0, 0), new Point(1, 3, 0))
    const ray = new Ray(new Point(-1, 0, 0), vector)
    const triangle = new Triangle(
      new Point(0, 0, 0),
      new Point(0, 2, 0),
      new Point(2, 0, 0))

    const intersection = intersectionTriangleRay(triangle, ray)

    if (intersection.type != IntersectionType.Segment) throw new Error("intersection.type != IntersectionType.Segment: " + IntersectionType[intersection.type])
    expect(equalsTolerancePoint(intersection.segment.begin, new Point(0, 1.5, 0)))
    expect(equalsTolerancePoint(intersection.segment.end, new Point(.2, 1.8, 0)))
  })
})
