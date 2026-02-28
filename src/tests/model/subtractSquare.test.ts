import {SpaceModel} from "../../engine/models"
import {Point, Size} from "../../engine/models"
import {Verify, VerifyModelContext} from "../infrastructure"
import {VerticesContext} from "../infrastructure"
import {SubtractModel} from "../../engine/models"
import {CubeModel} from "../../engine/models"

const size = 100
const min = 0
const half = 50

const left = min
const front = min
const bottom = min
const right = size
const top = size
const back = size

function logVertices(context: VerifyModelContext<SpaceModel>) {
  context.logging.appendLine(`Model vertices`)
  for (const vertex of context.model.model.segments) {
    context.logging.appendLine(`  - ${vertex}`)
  }
}

test('subtract square in square', async () => {

  const segments = 4
  const segmentsHalf = 2
  const sizeSquare = new Size(100, 100, 100)
  const square = CubeModel.create(4)
  const squarePush = new SpaceModel(CubeModel.create(4), new Point(50, 50, 50), sizeSquare)

  const result = SubtractModel.create(square, squarePush, Point.null, Size.default)

  Verify.model(result, context => context
    .action(logVertices)
    .areEqual(model => model.scale, Size.default)
    .areEqual(model => model.position, Point.null)
    .collection(model => model.model.segments, context => new VerticesContext(context)
      .contains(segments, left, bottom, front, left, top, front, "front left")
      .contains(segments, right, bottom, front, right, top, front, "front right")
      .contains(segments, left, bottom, front, right, bottom, front, "front bottom")
      .contains(segments, left, top, front, right, top, front, "front top")

      .contains(segments, left, bottom, back, left, top, back, "back left")
      .contains(segments, left, bottom, back, right, bottom, back, "back bottom")

      .contains(segmentsHalf, left, half, back, right, bottom, back, "back top half")
      .contains(segmentsHalf, right, bottom, back, right, half, back, "back right half")

      .contains(segmentsHalf, half, half, back, half, top, back, "back half top")
      .contains(segmentsHalf, half, half, back, right, half, back, "back half right")

      .contains(segmentsHalf, half, half, half, half, top, half, "middle half left")
      .contains(segmentsHalf, right, half, half, right, top, half, "middle half right")
      .contains(segmentsHalf, half, half, half, right, half, half, "middle half bottom")
      .contains(segmentsHalf, half, top, half, right, top, half, "middle half top")

      .contains(segments, left, bottom, front, left, bottom, back, "z left bottom")
      .contains(segments, left, top, front, left, top, back, "z left top")
      .contains(segments, right, bottom, front, right, bottom, back, "z right bottom")
      .contains(segmentsHalf, right, bottom, front, right, bottom, half, "z right top")

      .contains(segmentsHalf, half, half, half, half, half, back, "z middle half")
      .contains(segmentsHalf, half, top, half, half, top, back, "z middle top")
      .contains(segmentsHalf, right, half, half, right, half, back, "z middle right")

      .logRemaining()
    )
  )
})
