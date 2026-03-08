import {Segment, SpaceModel} from "../../engine/models"
import {Point, Size} from "../../engine/models"
import {Verify, VerifyLogging} from "../infrastructure"
import {SegmentsContext} from "../infrastructure"
import {SubtractModel} from "../../engine/models"
import {CubeModel} from "../../engine/models"
import {Text} from "../../engine/nothing"

const segments = 4
const segmentsHalf = 2
const segmentsOne = 1

function createLogger(factor: number | null = null) {

  const lines: string[] = []

  function logLine(message: Text) {
    lines.push(message);
  }

  function log(segment: Segment, message: Text) {
    const temp = factor != null ? new Segment(segment.begin.divide(factor), segment.end.divide(factor), segment.type, segment.debug) : segment
    lines.push(` - ${temp}: ${message}`)
  }

  function dump(logging: VerifyLogging) {
    logging.appendLine(`------------------------------------------\nsubtraction log: \n${lines.join("\n")}\n------------------------------------------\n`)
  }

  return {
    logLine: logLine,
    log: log,
    dump: dump
  }
}

test('subtract square in square', async () => {

  const size = 1
  const min = 0
  const half = .5

  const left = min
  const front = min
  const bottom = min
  const right = size
  const top = size
  const back = size


  const sizeSquare = new Size(1, 1, 1)
  const square = CubeModel.create(4, Point.null, Point.single(size))
  const subtractSquare = new SpaceModel(CubeModel.create(4), Point.single(half), sizeSquare)

  const logger = createLogger()
  const result = SubtractModel.create(square, subtractSquare, Point.null, Size.default, logger)

  Verify.model(result, context => context

    .areEqual(model => model.scale, Size.default)
    .areEqual(model => model.position, Point.null)
    .collection(model => model.segments, context => new SegmentsContext(context)
      .logSegments("init")

      .contains(segments, left, bottom, front, left, top, front, "front left")
      .contains(segments, right, bottom, front, right, top, front, "front right")
      .contains(segments, left, bottom, front, right, bottom, front, "front bottom")
      .contains(segments, left, top, front, right, top, front, "front top")

      .contains(segments, left, bottom, back, left, top, back, "back left")
      .contains(segments, left, bottom, back, right, bottom, back, "back bottom")

      .contains(segmentsHalf, left, top, back, half, top, back, "back left half")
      .contains(segmentsHalf, right, bottom, back, right, half, back, "back right half")

      .contains(segmentsOne, half, half, back, half, top, back, "back half top")
      .contains(segmentsOne, half, half, back, right, half, back, "back half right")

      .contains(segmentsHalf, half, half, half, half, top, half, "middle half left")
      .contains(segmentsHalf, half, half, half, right, half, half, "middle half bottom")

      .contains(segmentsOne, right, half, half, right, top, half, "middle half right")
      .contains(segmentsOne, half, top, half, right, top, half, "middle half top")

      .contains(segments, left, bottom, front, left, bottom, back, "z left bottom")
      .contains(segments, left, top, front, left, top, back, "z left top")
      .contains(segments, right, bottom, front, right, bottom, back, "z right bottom")

      .contains(segmentsHalf, half, half, half, half, half, back, "z middle half")

      .contains(segmentsOne, half, top, half, half, top, back, "z middle top")
      .contains(segmentsOne, right, half, half, right, half, back, "z middle right")

      .contains(segmentsHalf, right, top, front, right, top, half, "z right top")

      .logSegments("remaining")
      .log(logging => logger.dump(logging))
      .verifyNoRemaining()
    )
  )
})

test('subtract square in square scaled', async () => {

  const size = 100
  const min = 0
  const half = 50

  const left = min
  const front = min
  const bottom = min
  const right = size
  const top = size
  const back = size

  const sizeSquare = new Size(100, 100, 100)
  const square = CubeModel.create(4, Point.null, Point.single(100))
  const subtractSquare = new SpaceModel(CubeModel.create(4), new Point(50, 50, 50), sizeSquare)

  const logger = createLogger(size)
  const result = SubtractModel.create(square, subtractSquare, Point.null, Size.default, logger)

  Verify.model(result, context => context

    .areEqual(model => model.scale, Size.default)
    .areEqual(model => model.position, Point.null)
    .collection(model => model.segments, context => new SegmentsContext(context, 100)
      .logSegments("init")

      .contains(segments, left, bottom, front, left, top, front, "front left")
      .contains(segments, right, bottom, front, right, top, front, "front right")
      .contains(segments, left, bottom, front, right, bottom, front, "front bottom")
      .contains(segments, left, top, front, right, top, front, "front top")

      .contains(segments, left, bottom, back, left, top, back, "back left")
      .contains(segments, left, bottom, back, right, bottom, back, "back bottom")

      .contains(segmentsHalf, left, top, back, half, top, back, "back left half")
      .contains(segmentsHalf, right, bottom, back, right, half, back, "back right half")

      .contains(segmentsOne, half, half, back, half, top, back, "back half top")
      .contains(segmentsOne, half, half, back, right, half, back, "back half right")

      .contains(segmentsHalf, half, half, half, half, top, half, "middle half left")
      .contains(segmentsHalf, half, half, half, right, half, half, "middle half bottom")

      .contains(segmentsOne, right, half, half, right, top, half, "middle half right")
      .contains(segmentsOne, half, top, half, right, top, half, "middle half top")

      .contains(segments, left, bottom, front, left, bottom, back, "z left bottom")
      .contains(segments, left, top, front, left, top, back, "z left top")
      .contains(segments, right, bottom, front, right, bottom, back, "z right bottom")

      .contains(segmentsHalf, half, half, half, half, half, back, "z middle half")

      .contains(segmentsOne, half, top, half, half, top, back, "z middle top")
      .contains(segmentsOne, right, half, half, right, half, back, "z middle right")

      .contains(segmentsHalf, right, top, front, right, top, half, "z right top")

      .logSegments("remaining")
      .log(logging => logger.dump(logging))
      .verifyNoRemaining()
    )
  )
})
