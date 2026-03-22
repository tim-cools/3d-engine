import {Point, Subtract} from "../../engine/models"
import {Verify} from "../infrastructure"
import {ModelContext} from "../infrastructure/modelContext"
import {subtractTriangleTestCases5} from "./subtractTriangleTestCases5"
import {SubtractModels} from "../../engine/intersections/subtractModels"

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

test('subtract faces 5.1 side', async () => {
  const result = subtractTriangleTestCases5.intersect1_side()
  verifyPath(result, points, 1)
})

test('subtract faces 5.2 perpendicular', async () => {
  const result = subtractTriangleTestCases5.intersect2_perpendicular()
  verifyPath(result, points, 1)
})
