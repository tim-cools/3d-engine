import {VerifyCollectionContext} from "./verifyCollectionContext"
import {ModelType, Segment} from "../../engine/models"
import {Point} from "../../engine/models"
import {VerifyLogging} from "./verifyLogging"
import {segments} from "../../engine/models/segments"
import {IntersectionType} from "../../engine/intersections/intersectionResult"

export class SegmentsContext {

  private readonly context: VerifyCollectionContext<Segment>
  private readonly model: readonly Segment[]
  private readonly logging: VerifyLogging
  private readonly remaining: Segment[]
  private readonly factor: number | null = null

  constructor(context: VerifyCollectionContext<Segment>, factor: number | null = null) {
    this.context = context
    this.remaining = context.model.filter(value => !value.debug)
    this.model = context.model
    this.logging = context.logging
    this.factor = factor
  }

  primarySegments(number: number) {
    this.context.count(number, item => item.type == ModelType.Primary, "Primary segments")
    return this
  }

  secondarySegments(number: number) {
    this.context.count(number, item => item.type == ModelType.Secondary, "Secondary segments")
    return this
  }

  thirdSegments(number: number) {
    this.context.count(number, item => item.type == ModelType.Third, "Third segments")
    return this
  }

  disabledSegments(number: number) {
    this.context.count(number, item => item.type == ModelType.Disabled, "Disabled segments")
    return this
  }

  contains(segmentsNumber: number, beginX: number, beginY: number, beginZ: number, endX: number, endY: number, endZ: number, message: string | null): SegmentsContext {
    const begin = new Point(beginX, beginY, beginZ)
    const end = new Point(endX, endY, endZ)
    const lineSegments = segments(segmentsNumber, begin, end)
    for (const expected of lineSegments) {
      const actualIndex = this.remaining.findIndex(segment => segment.equals(expected))
      if (actualIndex >= 0) {
        this.remaining.splice(actualIndex, 1)
      }
      this.logging.logAssert(actualIndex >= 0, message, `  - contains segment failed '${expected.begin}'-'${expected.end}': `)
    }
    return this
  }

  logSegments(title: string) {
    this.logging.appendLine(`${title}: ${this.remaining.length}`)
    for (const segment of this.remaining) {
      this.logging.appendLine(`  - ${title}: '${segment}'`)
    }
    return this
  }

  log(handler: (logging: VerifyLogging) => void) {
    handler(this.logging)
    return this
  }

  verifyNoRemaining() {
    this.logging.logAssert(this.remaining.length == 0, `Count: ${this.remaining.length}` ,`  - Not all segments checked`)
    return this
  }
}
