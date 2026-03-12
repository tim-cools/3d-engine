import {VerifyLogging} from "./verifyLogging"
import {Face, Model, Point, Segment, SpaceModel} from "../../engine/models"
import {equalsTolerancePoint} from "../../engine/models/equals"
import {nothing} from "../../engine/nothing"
import {VerifyModelContext} from "./verifyModelContext"

export class ModelContext {

  private readonly context: VerifyModelContext<SpaceModel>
  private readonly logging: VerifyLogging
  private readonly model: SpaceModel
  private readonly faces: Face[]
  private readonly segments: Segment[]
  private readonly factor: number | null = null

  constructor(context: VerifyModelContext<SpaceModel>, factor: number | null = null) {
    this.context = context
    this.faces = [...context.model.faces] // .filter(value => !value.debug)
    this.segments = context.model.segments.filter(value => !value.debug)
    this.model = context.model
    this.logging = context.logging
    this.factor = factor
  }

  containsSegments(points: readonly Point[]): ModelContext {

    if (this.segments.length != points.length - 1) {
      this.logging.fail(`segments.length != ${points.length - 1}`, `segments.length = ${this.segments.length} - `)
    }

    const log: string[] = []
    for (let index = 0; index < points.length - 1; index++){
      const expectedBegin = points[index]
      const expectedEnd = points[index + 1]
      const expected = new Segment(expectedBegin, expectedEnd)
      const segmentIndex = this.segments.findIndex(value => value.equals(expected))
      if (segmentIndex < 0) {
        log.push(`  - segment ${index}: (nothing) != \n    expected   begin (${expectedBegin}) end (${expectedEnd})`)
      } else {
        this.segments.splice(segmentIndex, 1)
      }
    }

    for (const segment of this.segments) {
      log.push(`  - remaining: ${segment}`)
    }

    this.logging.logAssert(log.length == 0, log.join("\n"), `segments invalid: \n`)
    return this
  }

  containsPolygon(points: readonly Point[]): ModelContext {

    if (this.faces.length != 1) {
      this.logging.fail("faces.length != 1", "faces = " + this.faces.length)
      return this
    }

    const face = this.faces[0]
    /* todo
    if (face.points.length != points.length) {
      this.logging.fail(`face.points.length != ${points.length}`, `face.points = ${face.points.length} - `)
    }

    const log: string[] = []
    for (let index = 0; index < Math.max(face.points.length, points.length); index++){
      const point = index < face.points.length  ? face.points[index] : nothing
      const expected = index < points.length ? points[index] : nothing

      if (point == nothing) {
        log.push(`  - point ${index}: (nothing) != expected (${expected})`)
      } else if (expected == nothing) {
        log.push(`  - point ${index}: (${point}) != expected (nothing)`)
      } else if (!equalsTolerancePoint(point, expected)) {
        log.push(`  - point ${index}: (${point}) != (${expected})`)
      }
    }

    this.logging.logAssert(log.length == 0, log.join("\n"), `polygon invalid: \n`)
        */
    return this
  }

  logFaces(title: string) {
    this.logging.appendLine(`${title}: ${this.faces.length}`)
    for (const segment of this.faces) {
      this.logging.appendLine(`  - ${title}: '${segment}'`)
    }
    return this
  }

  log(handler: (logging: VerifyLogging) => void) {
    handler(this.logging)
    return this
  }
}
