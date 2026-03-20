import {Point, Subtract} from "../../engine/models"
import {Verify} from "../infrastructure"
import {ModelContext} from "../infrastructure/modelContext"
import {subtractTriangleTestCases3} from "./subtractTriangleTestCases3"
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

test('subtract faces 3.1 point 1', async () => {
  const result = subtractTriangleTestCases3.intersect1_point1()
  verifyPath(result, points, 1)
})

test('subtract faces 3.2 segmentAC line', async () => {
  const result = subtractTriangleTestCases3.intersect2_segmentAC_line()
  verifyPath(result, points, 2)     //todo: can be reduced to 1
})

test('subtract faces 3.3 cornerAB line', async () => {
  const result = subtractTriangleTestCases3.intersect3_segmentAC_cornerAB_line()
  verifyPath(result, points, 2)     //todo: can be reduced to 1
})

test('subtract faces 3.4 point2', async () => {
  const result = subtractTriangleTestCases3.intersect4_point2()
  verifyPath(result, points, 1)
})

test('subtract faces 3.5 segmentBC line', async () => {
  const result = subtractTriangleTestCases3.intersect5_segmentBC_line()
  verifyPath(result, points, 2)     //todo: can be reduced to 1
})

test('subtract faces 3.6 segmentAB line', async () => {
  const result = subtractTriangleTestCases3.intersect6_segmentAB_line()
  verifyPath(result, points, 2)     //todo: can be reduced to 1
})

test('subtract faces 3.7 point 3', async () => {
  const result = subtractTriangleTestCases3.intersect7_point3()
  verifyPath(result, points, 1)
})

test('subtract faces 3.8 segmentBC line', async () => {
  const result = subtractTriangleTestCases3.intersect8_segmentBC_line()
  verifyPath(result, points, 2)     //todo: can be reduced to 1
})

test('subtract faces 3.9 segmentCA line(', async () => {
  const result = subtractTriangleTestCases3.intersect9_segmentCA_line()
  verifyPath(result, points, 2)     //todo: can be reduced to 1
})
