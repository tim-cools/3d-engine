import {Point} from "../../engine/models"
import {Verify} from "../infrastructure"
import {SegmentsContext} from "../infrastructure"
import {CubeModel} from "../../engine/models"

test('create square', async () => {

  const size = 1
  const min = 0

  const left = min
  const front = min
  const bottom = min
  const right = size
  const top = size
  const back = size

  const square = CubeModel.create(1, Point.null, Point.one)

  Verify.model(square, context => context
    .collection(model => square.segments, context => new SegmentsContext(context)
      .logSegments("init")

      .contains(1, left, bottom, front, left, top, front, "front left")
      .contains(1, right, bottom, front, right, top, front, "front right")
      .contains(1, left, bottom, front, right, bottom, front, "front bottom")
      .contains(1, left, top, front, right, top, front, "front top")

      .contains(1, left, bottom, back, left, top, back, "back left")
      .contains(1, right, bottom, back, right, top, back, "front right")
      .contains(1, left, bottom, back, right, bottom, back, "back bottom")
      .contains(1, left, top, back, right, top, back, "front top")

      .contains(1, left, bottom, front, left, bottom, back, "z left bottom")
      .contains(1, left, top, front, left, top, back, "z left top")
      .contains(1, right, bottom, front, right, bottom, back, "z right bottom")
      .contains(1, right, top, front, right, top, back, "z right top")

      .logSegments("remaining")
      .verifyNoRemaining()
    )
  )
})
