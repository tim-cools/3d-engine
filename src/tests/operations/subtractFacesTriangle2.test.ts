import {Point, Subtract, SubtractModels} from "../../engine/models"
import {Verify} from "../infrastructure"
import {ModelContext} from "../infrastructure/modelContext"
import {subtractTriangleTestCases2} from "./subtractTriangleTestCases2"

function verifyPath(models: SubtractModels, points: Point[][], triangles: number) {
  const result = Subtract.faces(models)
  Verify.model(result, context => {
      new ModelContext(context)
        .containsPaths(points)
        .validateTriangles(triangles)
    }
  )
}

test('subtract faces 2 intersect 1 triangle 1 point 1', async () => {
  const result = subtractTriangleTestCases2.intersect1_point1()
  const points = [[
    new Point(0, 0, 0),
    new Point(1, 0, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0),
  ]]
  verifyPath(result, points, 1)
})

test('subtract faces 2 intersect 2 segment AC line', async () => {
  const result = subtractTriangleTestCases2.intersect2_segmentAC_line()
  const points = [[
    new Point(0.5, 0, 0),
    new Point(1, 0, 0),
    new Point(0, 1, 0),
    new Point(0, 0.5, 0),
    new Point(0.5, 0, 0),
  ]]
  verifyPath(result, points, 2)
})

test('subtract faces 2 intersect 3 triangle 1 point 1', async () => {
  const result = subtractTriangleTestCases2.intersect3_segmentAC_corner()
  const points = [[
    new Point(0.5, 0.5, 0),
    new Point(0.5, 0, 0),
    new Point(1, 0, 0),
    new Point(0.5, 0.5, 0),
    new Point(0, 1, 0),
    new Point(0, 0.5, 0),
    new Point(0.5, 0.5, 0),
  ]]
  verifyPath(result, points, 2)
})

