import {Point} from "../../engine/models"
import {Verify} from "../infrastructure"
import {ModelContext} from "../infrastructure/modelContext"
import {subtractTriangleTestCases2} from "./subtractTriangleTestCases2"

test('subtract triangle 1 intersect segment bc', async () => {
  const result = subtractTriangleTestCases2.intersect1_point1()
  const points = [
    new Point(0, 0, 0),
    new Point(.5, 0, 0),
    new Point(.5, .5, 0),
    new Point(0, 1, 0),
    new Point(0, 0, 0)
  ]
  Verify.model(result, context => new ModelContext(context)
    .containsPolygon(points)
    .containsSegments(points)
  );
})
