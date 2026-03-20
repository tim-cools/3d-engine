import {Point, Subtract} from "../../engine/models"
import {Verify} from "../infrastructure"
import {ModelContext} from "../infrastructure/modelContext"
import {subtractTriangleTestCases2} from "./subtractTriangleTestCases2"
import {SubtractModels} from "../../engine/intersections"

function verifyPath(models: SubtractModels, points: Point[][], triangles: number) {
  const result = Subtract.faces(models)
  Verify.model(result, context => {
      new ModelContext(context)
        .containsPaths(points)
        .validateTriangles(triangles)
    }
  )
}

test('subtract faces 2.1 triangle 1 point 1', async () => {
  const result = subtractTriangleTestCases2.intersect1_point1()
  const points = [[
    new Point(0, 0, 0),
    new Point(1, 0, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0),
  ]]
  verifyPath(result, points, 1)
})

test('subtract faces 2.2 segment AC line', async () => {
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

test('subtract faces 2.3 triangle 1 point 1', async () => {
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

test('subtract faces 2.4 point 2', async () => {
  const result = subtractTriangleTestCases2.intersect4_point2()
  const points = [[
    new Point(0, 0, 0),
    new Point(1, 0, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0),
  ]]
  verifyPath(result, points, 1)
})

test('subtract faces 2.5 segment AB line', async () => {
  const result = subtractTriangleTestCases2.intersect5_segmentAB_line()
  const points = [[
    new Point(0, 0, 0),
    new Point(0.5, 0, 0),
    new Point(0.75, 0.25, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0),
  ]]
  verifyPath(result, points, 2)
})

test('subtract faces 2.6 segment AB corner', async () => {
  const result = subtractTriangleTestCases2.intersect6_segmentAB_corner()
  const points = [[
    new Point(0, 0, 0),
    new Point(0.5, 0, 0),
    new Point(0.5, 0.25, 0),
    new Point(0.75, 0.25, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0),
  ]]
  verifyPath(result, points, 3)
})

test('subtract faces 2.7 point 3', async () => {
  const result = subtractTriangleTestCases2.intersect7_point3()
  const points = [[
    new Point(0, 0, 0),
    new Point(1, 0, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0),
  ]]
  verifyPath(result, points, 1)
})

test('subtract faces 2.8 segment BC line', async () => {
  const result = subtractTriangleTestCases2.intersect8_segmentBC_line()
  const points = [[
    new Point(0, 0, 0),
    new Point(1, 0, 0),
    new Point(0.25, 0.75, 0),
    new Point(0, 0.5, 0),
    new Point(0, 0, 0),
  ]]
  verifyPath(result, points, 2)
})

test('subtract faces 2.9 segment BC corner', async () => {
  const result = subtractTriangleTestCases2.intersect9_segmentBC_corner()
  const points = [[
    new Point(0, 0, 0),
    new Point(1, 0, 0),
    new Point(0.25, 0.75, 0),
    new Point(0.25, 0.5, 0),
    new Point(0, 0.5, 0),
    new Point(0, 0, 0),
  ]]
  verifyPath(result, points, 3)
})



