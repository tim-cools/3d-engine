import {Point, Subtract} from "../../engine/models"
import {Verify} from "../infrastructure"
import {ModelContext} from "../infrastructure/modelContext"
import {subtractTriangleTestCases2} from "./subtractTriangleTestCases2"
import {SubtractModels} from "../../engine/intersections"

function verifyPath(models: SubtractModels, points: Point[], triangles: number) {
  const result = Subtract.segments(models)
  Verify.model(result, context => new ModelContext(context)
    .containsSegments(points)
  )
}

test('subtract segments 2.1 point 1', async () => {
  const result = subtractTriangleTestCases2.intersect1_point1()
  const points = [
    new Point(0, 0, 0),
    new Point(1, 0, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0),
  ]
  verifyPath(result, points, 1)
})

/*
test('subtract segments 2.2 segment ac line', async () => {
  const result = subtractTriangleTestCases2.intersect2_segmentAC_line()
  const points = [
    new Point(0.5, 0.5, 0),
    new Point(1, 0, 0),
    new Point(0, 1, 0),
    new Point(0, .5, 0)
  ]
  Verify.model(result, context => new ModelContext(context)
    .containsPath(points)
    .containsSegments(points)
    .validateTriangles(2)
  );
})

test('subtract segments 2.3 segment ac corner', async () => {
  const result = subtractTriangleTestCases2.intersect3_segmentAC_corner()
  const points = [
    new Point(0.5, 0.5, 0),
    new Point(1, 0, 0),
    new Point(.5, 1, 0),
    new Point(.5, 1, 0),
    new Point(1, 1, 0),
    new Point(0, .5, 0),
  ]
  Verify.model(result, context => new ModelContext(context)
    .containsPath(points)
    .containsSegments(points)
    .validateTriangles(2)
  );
})

test('subtract segments 2.4 segment ac corner', async () => {
  const result = subtractTriangleTestCases2.intersect4_point2()
  const points = [
    new Point(0, 0, 0),
    new Point(1, 0, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0)
  ]
  Verify.model(result, context => new ModelContext(context)
    .containsPath(points)
    .containsSegments(points)
    .validateTriangles(2)
  );
})

test('subtract segments 2.5 segment ab line', async () => {
  const result = subtractTriangleTestCases2.intersect5_segmentAB_line()
  const points = [
    new Point(0, 0, 0),
    new Point(.5, 0, 0),
    new Point(.75, .25, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0)
  ]
  Verify.model(result, context => new ModelContext(context)
    .containsPath(points)
    .containsSegments(points)
    .validateTriangles(2)
  );
})

test('subtract segments 2.6 segment ab corner', async () => {
  const result = subtractTriangleTestCases2.intersect6_segmentAB_corner()
  const points = [
    new Point(0, 0, 0),
    new Point(.5, 0, 0),
    new Point(.5, .25, 0),
    new Point(.75, .25, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0)
  ]
  Verify.model(result, context => new ModelContext(context)
    .containsPath(points)
    .containsSegments(points)
    .validateTriangles(2)
  );
})

test('subtract segments 2.7 point 3', async () => {
  const result = subtractTriangleTestCases2.intersect7_point3()
  const points = [
    new Point(0, 0, 0),
    new Point(1, 0, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0)
  ]
  Verify.model(result, context => new ModelContext(context)
    .containsPath(points)
    .containsSegments(points)
    .validateTriangles(2)
  );
})

test('subtract segments 2.8 segment bc line', async () => {
  const result = subtractTriangleTestCases2.intersect8_segmentBC_line()
  const points = [
    new Point(0, 0, 0),
    new Point(1, 0, 0),
    new Point(.25, .75, 0),
    new Point(0, .5, 0),
    new Point(0, 0, 0)
  ]
  Verify.model(result, context => new ModelContext(context)
    .containsPath(points)
    .containsSegments(points)
    .validateTriangles(2)
  );
})
*/
