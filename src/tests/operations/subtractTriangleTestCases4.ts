import {ModelType, Point, Size, SpaceModel, SubtractModels, Triangle} from "../../engine/models"
import {TriangleModel} from "../../engine/models/triangleModel"

const flatTriangle = new Triangle(Point.null, new Point(1, 0, .5), new Point(1, 0, -.5))

function subtractTriangles(triangle: Triangle, points: {point1: Point, point2: Point, point3: Point}[]): SubtractModels {
  const triangleModel = TriangleModel.createFromTriangle(triangle)
  const subtracts = TriangleModel.createMultiple(points.map(point => new Triangle(point.point1, point.point2, point.point3, ModelType.Disabled, true)))
  const subtractSpace = new SpaceModel(subtracts, Point.null, Size.default)
  return new SubtractModels(triangleModel, subtractSpace)
}

export const subtractTriangleTestCases4 = {
  intersect1_skewedTriangle() {
    return subtractTriangles(flatTriangle, [
        {point1: new Point(.5, 1, 0), point2: new Point(.5, -1, -1), point3: new Point(.5, -1, 0)},
        {point1: new Point(.5, 1, 0), point2: new Point(.5, -1, -1), point3: new Point(-2, -1, 0)},

        {point1: new Point(.5, 1, 0), point2: new Point(.5, -1, 1), point3: new Point(.5, -1, 0)},
        {point1: new Point(.5, 1, 0), point2: new Point(.5, -1, 1), point3: new Point(-2, -1, 0)},
      ])
  },
  intersect2_outsideTriangle() {
    return subtractTriangles(flatTriangle, [
        {point1: new Point(-.15, .5, 0), point2: new Point(-.15, -.5, -.5), point3: new Point(-.15, -.5, 0)},
        {point1: new Point(-.15, .5, 0), point2: new Point(-.15, -.5, -.5), point3: new Point(-.5, -.5, 0)},

        {point1: new Point(-.15, .5, 0), point2: new Point(-.15, -.5, .5), point3: new Point(-.15, -.5, 0)},
        {point1: new Point(-.15, .5, 0), point2: new Point(-.15, -.5, .5), point3: new Point(-.5, -.5, 0)},
      ])
  },
  intersect3_skewedTriangle() {
    return subtractTriangles(new Triangle(new Point(0, -.5, 0), new Point(1, 0, .5), new Point(1, .5, -.5)), [
        {point1: new Point(.5, 1, 0), point2: new Point(.5, -1, -1), point3: new Point(.5, -1, 0)},
        {point1: new Point(.5, 1, 0), point2: new Point(.5, -1, -1), point3: new Point(-2, -1, 0)},

        {point1: new Point(.5, 1, 0), point2: new Point(.5, -1, 1), point3: new Point(.5, -1, 0)},
        {point1: new Point(.5, 1, 0), point2: new Point(.5, -1, 1), point3: new Point(-2, -1, 0)},
      ])
  },
  intersect4_skewedTriangle() {
    return subtractTriangles(new Triangle(Point.null, new Point(-1, 0, .5), new Point(-1, 0, -.5)), [
        {point1: new Point(-.5, 1, 0), point2: new Point(-.5, -1, -1), point3: new Point(-.5, -1, 0)},
        {point1: new Point(-.5, 1, 0), point2: new Point(-.5, -1, -1), point3: new Point(2, -1, 0)},

        {point1: new Point(-.5, 1, 0), point2: new Point(-.5, -1, 1), point3: new Point(-.5, -1, 0)},
        {point1: new Point(-.5, 1, 0), point2: new Point(-.5, -1, 1), point3: new Point(2, -1, 0)},
      ])
  },
  intersect5_outsideTriangle() {
    return subtractTriangles(new Triangle(Point.null, new Point(-1, 0, .5), new Point(-1, 0, -.5)), [
        {point1: new Point(.15, .5, 0), point2: new Point(.15, -.5, -.5), point3: new Point(.15, -.5, 0)},
        {point1: new Point(.15, .5, 0), point2: new Point(.15, -.5, -.5), point3: new Point(.5, -.5, 0)},

        {point1: new Point(.15, .5, 0), point2: new Point(.15, -.5, .5), point3: new Point(.15, -.5, 0)},
        {point1: new Point(.15, .5, 0), point2: new Point(.15, -.5, .5), point3: new Point(.5, -.5, 0)},
      ])
  },
  intersect6_skewedTriangle() {
    return subtractTriangles(new Triangle(new Point(0, -.5, 0), new Point(-1, 0, .5), new Point(-1, .5, -.5)), [
        {point1: new Point(-.5, 1, 0), point2: new Point(-.5, -1, -1), point3: new Point(-.5, -1, 0)},
        {point1: new Point(-.5, 1, 0), point2: new Point(-.5, -1, -1), point3: new Point(2, -1, 0)},

        {point1: new Point(-.5, 1, 0), point2: new Point(-.5, -1, 1), point3: new Point(-.5, -1, 0)},
        {point1: new Point(-.5, 1, 0), point2: new Point(-.5, -1, 1), point3: new Point(2, -1, 0)},
      ])
  },
}
