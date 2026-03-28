import {Point, Subtract} from "../../engine/models"
import {Verify} from "../infrastructure"
import {ModelContext} from "../infrastructure/modelContext"
import {subtractTriangleTestCases1} from "./subtractTriangleTestCases1"
import {SubtractModels} from "../../engine/intersections"

function verifySegments(models: SubtractModels, points: Point[]) {
  const result = Subtract.segments(models)
  Verify.model(result, context => new ModelContext(context)
    .containsSegments(points)
  )
}

test('subtract segments 1.1 intersect segment bc', async () => {
  const result = subtractTriangleTestCases1.intersect1_segmentBC()
  const points = [
    new Point(0, 0, 0),
    new Point(.5, 0, 0),
    new Point(.5, .5, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0)
  ]
  verifySegments(result, points)
})

test('subtract segments 1.2 intersect 2 point ca', async () => {
  const models = subtractTriangleTestCases1.intersect2_2pointCA()
  const points = [
    new Point(0, 0, 0),
    new Point(.5, 0, 0),
    new Point(0.5, 0.25, 0),
    new Point(.75, 0, 0),
    new Point(1, 0, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0)
  ]
  //verifySegments(models, points)  // not yet implemented, inlets are currently not supported by the subtractSegments
})

test('subtract segments 1.3 intersect 1 point ca', async () => {
  const result = subtractTriangleTestCases1.intersect3_1pointCA()
  const points = [
    new Point(0, 0, 0),
    new Point(1, 0, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0),
  ]
  verifySegments(result, points)
})

test('subtract segments 1.4 no intersect', async () => {
  const result = subtractTriangleTestCases1.intersect4_no()
  const points = [
    new Point(0, 0, 0),
    new Point(1, 0, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0),
  ]
  verifySegments(result, points)
})

test('subtract segments 1.5 intersect 1 point bc - ca', async () => {
  const result = subtractTriangleTestCases1.intersect5_1pointBC_CA()

  const points = [
    new Point(0, 0, 0),
    new Point(.5, 0, 0),
    new Point(.5, .5, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0)
  ]
  verifySegments(result, points)
})

test('subtract segments 1.6 intersect 1 point bc segment ca', async () => {
  const result = subtractTriangleTestCases1.intersect6_1pointBCSegmentCA()
  const points = [
    new Point(0, 0, 0),
    new Point(.5, 0, 0),
    new Point(.5, .5, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0)
  ]
  verifySegments(result, points)
})

test('subtract segments 1.7 intersect 2 point bc', async () => {
  const models = subtractTriangleTestCases1.intersect7_2pointsBC()
  const points = [
    new Point(0, 0, 0),
    new Point(1, 0, 0),
    new Point(.75, .25, 0),
    new Point(.5, .25, 0),
    new Point(.5, 0.5, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0)
  ]
  //verifySegments(models, points)  // not yet implemented, inlets are currently not supported by the subtractSegments
})

test('subtract segments 1.8 intersect 1 point bc', async () => {
  const result = subtractTriangleTestCases1.intersect8_1pointBC()
  const points = [
    new Point(0, 0, 0),
    new Point(1, 0, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0),
  ]
  verifySegments(result, points)
})

test('subtract segments 1.9 no intersect above', async () => {
  const result = subtractTriangleTestCases1.intersect9_noTriangleAbove()
  const points = [
    new Point(0, 0, 0),
    new Point(1, 0, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0)
  ]
  verifySegments(result, points)
})
