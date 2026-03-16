import {Point, Subtract, SubtractModels} from "../../engine/models"
import {Verify} from "../infrastructure"
import {ModelContext} from "../infrastructure/modelContext"
import {subtractTriangleTestCases1} from "./subtractTriangleTestCases1"

function verifyPath(models: SubtractModels, points: Point[], triangles: number) {
  const result = Subtract.faces(models)
  Verify.model(result, context => new ModelContext(context)
    .containsPath(points)
    .validateTriangles(triangles)
  )
}

function verifyTriangle(models: SubtractModels, points: Point[], triangles: number) {
  const result = Subtract.faces(models)
  Verify.model(result, context => new ModelContext(context)
    .containsTriangle(points)
    .validateTriangles(triangles)
  )
}

test('subtract faces 1 triangle 1 intersect segment bc', async () => {
  const result = subtractTriangleTestCases1.intersect1_segmentBC()
  const points = [
    new Point(0, 0, 0),
    new Point(.5, 0, 0),
    new Point(.5, .5, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0)
  ]
  verifyPath(result, points, 2)
})

test('subtract faces 1 triangle 2 intersect 2 point ca', async () => {
  const result = subtractTriangleTestCases1.intersect2_2pointCA()
  const points = [
    new Point(0, 0, 0),
    new Point(.5, 0, 0),
    new Point(0.5, 0.25, 0),
    new Point(.75, 0, 0),
    new Point(1, 0, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0)
  ]
  verifyPath(result, points, 4)
})

test('subtract faces 1 triangle 3 intersect 1 point ca', async () => {
  const result = subtractTriangleTestCases1.intersect3_1pointCA()
  const points = [
    new Point(0, 0, 0),
    new Point(1, 0, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0),
  ]
  verifyPath(result, points, 1)
})

test('subtract faces 1 triangle 4 no intersect', async () => {
  const result = subtractTriangleTestCases1.intersect4_no()
  const points = [
    new Point(0, 0, 0),
    new Point(1, 0, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0),
  ]
  verifyTriangle(result, points, 1)
})

test('subtract faces 1 triangle 5 intersect 1 point bc - ca', async () => {
  const result = subtractTriangleTestCases1.intersect5_1pointBC_CA()

  const points = [
    new Point(0, 0, 0),
    new Point(.5, 0, 0),
    new Point(.5, .5, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0)
  ]
  verifyPath(result, points, 2)
})

test('subtract faces 1 triangle 6 intersect 1 point bc segment ca', async () => {
  const result = subtractTriangleTestCases1.intersect6_1pointBCSegmentCA()
  const points = [
    new Point(0, 0, 0),
    new Point(.5, 0, 0),
    new Point(.5, .5, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0)
  ]
  verifyPath(result, points, 2)
})

test('subtract faces 1 triangle 7 intersect 2 point bc', async () => {
  const result = subtractTriangleTestCases1.intersect7_2pointsBC()
  const points = [
    new Point(0, 0, 0),
    new Point(1, 0, 0),
    new Point(.75, .25, 0),
    new Point(.5, .25, 0),
    new Point(.5, 0.5, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0)
  ]
  verifyPath(result, points, 4)
})

test('subtract faces 1 triangle 8 intersect 1 point bc', async () => {
  const result = subtractTriangleTestCases1.intersect8_1pointBC()
  const points = [
    new Point(0, 0, 0),
    new Point(1, 0, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0),
  ]
  verifyPath(result, points, 1)
})

test('subtract faces 1 triangle 9 no intersect above', async () => {
  const result = subtractTriangleTestCases1.intersect9_noTriangleAbove()
  const points = [
    new Point(0, 0, 0),
    new Point(1, 0, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0)
  ]
  verifyTriangle(result, points, 1)
})
