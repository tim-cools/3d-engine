import {Point, Subtract} from "../../engine/models"
import {Verify} from "../infrastructure"
import {ModelContext} from "../infrastructure/modelContext"
import {subtractTriangleTestCases4} from "./subtractTriangleTestCases4"
import {SubtractModels} from "../../engine/intersections"

const points = [[
  new Point(0, 0, 0),
  new Point(1, 0, 0),
  new Point(0, 1, 0),
  new Point(0, 0, 0),
]]

function verifyPath(models: SubtractModels, points: Point[][], triangles: number) {
  const result = Subtract.faces(models)
  Verify.model(result, context => {
      new ModelContext(context)
        .containsPaths(points)
        .validateTriangles(triangles)
    }
  )
}

test('subtract faces 4.1 skewed triangle', async () => {
  const result = subtractTriangleTestCases4.intersect1_skewedTriangle()
  verifyPath(result, points, 1)
})

test('subtract faces 4.2 outside triangle', async () => {
  const result = subtractTriangleTestCases4.intersect2_outsideTriangle()
  verifyPath(result, points, 1)
})

test('subtract faces 4.3 skewed triangle', async () => {
  const result = subtractTriangleTestCases4.intersect3_skewedTriangle()
  verifyPath(result, points, 1)
})

test('subtract faces 4.4 skewed triangle', async () => {
  const result = subtractTriangleTestCases4.intersect4_skewedTriangle()
  verifyPath(result, points, 1)
})

test('subtract faces 4.5 outside triangle', async () => {
  const result = subtractTriangleTestCases4.intersect5_outsideTriangle()
  verifyPath(result, points, 1)
})

test('subtract faces 4.6 skewed triangle', async () => {
  const result = subtractTriangleTestCases4.intersect6_skewedTriangle()
  verifyPath(result, points, 1)
})
