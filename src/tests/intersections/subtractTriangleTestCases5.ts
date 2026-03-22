import {ModelType, Point, Size, SpaceModel, Triangle} from "../../engine/models"
import {TriangleModel} from "../../engine/models/triangleModel"
import {SubtractModels} from "../../engine/intersections"

const twoTriangles = [
  new Triangle(new Point(0, .5, 0), new Point(0, -.5, .5), new Point(0, -.5, -.5)),
  new Triangle(new Point(-1, .5, 0), new Point(-1, -.5, .5), new Point(-1, -.5, -.5)),
]

function subtractTriangles(triangles: Triangle[], points: {point1: Point, point2: Point, point3: Point}[]): SubtractModels {
  const triangleModel = TriangleModel.createMultiple(triangles)
  const subtracts = TriangleModel.createMultiple(points.map(point => new Triangle(point.point1, point.point2, point.point3, ModelType.Disabled, true)))
  const subtractSpace = new SpaceModel(subtracts, Point.null, Size.default)
  return new SubtractModels(triangleModel, subtractSpace)
}

export const subtractTriangleTestCases5 = {
  intersect1_side() {
    return subtractTriangles(twoTriangles, [
      new Triangle(new Point(.5, .5, 0), new Point(-.5, -.5, 0), new Point(-.5, -.5, -1)),
      new Triangle(new Point(1, .5, 0), new Point(1, -.5, .5), new Point(1, -.5, -.5)),
    ])
  },
  intersect2_perpendicular() {
    return subtractTriangles(twoTriangles, [
      new Triangle(new Point(.5, .5, 0), new Point(-.5, -.8, 0), new Point(.5, -.8, 0)),
      new Triangle(new Point(1, .5, 0), new Point(1, -.5, .5), new Point(1, -.5, -.5)),
    ])
  }
}
