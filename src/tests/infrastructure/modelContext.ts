import {VerifyLogging} from "./verifyLogging"
import {
  Face,
  FaceType,
  Model,
  PathSegment,
  Point,
  Segment,
  SegmentBase,
  Triangle
} from "../../engine/models"
import {nothing} from "../../infrastructure/nothing"
import {VerifyModelContext} from "./verifyModelContext"
import {any, firstOrDefault, selectMany} from "../../infrastructure"

export class ModelContext {

  private readonly context: VerifyModelContext<Model>
  private readonly logging: VerifyLogging
  private readonly model: Model
  private readonly faces: Face[]
  private readonly segments: Segment[]
  private readonly factor: number | null = null

  constructor(context: VerifyModelContext<Model>, factor: number | null = null) {
    this.context = context
    this.faces = [...context.model.faces] // .filter(value => !value.debug)
    this.segments = context.model.segments.filter(value => !value.debug)
    this.model = context.model
    this.logging = context.logging
    this.factor = factor
  }

  containsSegments(points: readonly Point[]): ModelContext {

    const actualSegments = [...this.segments]

    if (actualSegments.length == 0 || actualSegments.length != points.length - 1) {
      this.logging.fail(`segments.length != ${points.length - 1}`, `actual = ${actualSegments.length} - `)
    }

    const log: string[] = []
    for (let index = 0; index < points.length - 1; index++) {
      const expected = new PathSegment(points[index], points[index + 1])
      const segmentIndex = actualSegments.findIndex(value => value.equals(expected))
      if (segmentIndex < 0) {
        log.push(`  - segment ${index}: (nothing) != \n    expected (${expected})`)
      } else {
        actualSegments.splice(segmentIndex, 1)
      }
    }

    for (const segment of actualSegments) {
      log.push(`  - remaining: ${segment}`)
    }

    this.logging.logAssert(log.length == 0, log.join("\n"), `segment invalid: \n`)

    return this
  }

  containsPath(points: readonly Point[]): ModelContext {

    const face = firstOrDefault(this.faces, value => !value.debug)
    if (face == null) {
      this.logging.fail(`no face found`, "containsPath")
      return this
    }
    return this.verifyPath(face, points)
  }

  private verifyPath(face: Face, points: readonly Point[]) {

    if (face.faceType != FaceType.Polygon) {
      this.logging.fail(`this.faces.faceType != FaceType.Polygon`, "containsPath")
      return this
    }

    const actualSegments = face.segments
    if (actualSegments.length == 0 || actualSegments.length != points.length - 1) {
      this.logging.fail(`path segment.length != ${points.length - 1}`, `actual = ${actualSegments.length} - `)
    }

    const segments = ModelContext.segmentsFrom(actualSegments, points[0])
    const log: string[] = []
    for (let index = 0; index < points.length - 1; index++) {
      const expected = new PathSegment(points[index], points[index + 1])
      const actual = index < segments.length ? segments[index] : nothing
      if (actual == nothing) {
        log.push(`  - path segment ${index}: (nothing) != \n    expected (${expected})`)
      } else if (!expected.equals(actual)) {
        log.push(`  - path segment ${index}: (${actual}) != \n    expected (${expected})`)
      }
    }

    this.logging.logAssert(log.length == 0, log.join("\n"), `path segment invalid: \n`)

    return this
  }

  containsPaths(points: readonly Point[][]): ModelContext {

    for (const facePoint of points) {
      const face = firstOrDefault(this.faces, value => !value.debug && any(value.points, point => point.equals(facePoint[0])))
      if (face == null) {
        this.logging.fail(`no face found`, "containsPath")
      } else {
        this.verifyPath(face, facePoint)
      }
    }

    return this
  }

  containsTriangle(points: readonly Point[]): ModelContext {

    const face = firstOrDefault(this.faces, value => !value.debug)
    if (face == null) {
      this.logging.fail(`no face found`, "containsPath")
      return this
    }

    if (face.faceType != FaceType.Triangle) {
      this.logging.fail(`this.faces.faceType != FaceType.Triangle`, "containsPath")
      return this
    }

    const triangle = face as Triangle
    this.verifyPoint(0, triangle.point1, points[0])
    this.verifyPoint(1, triangle.point2, points[1])
    this.verifyPoint(2, triangle.point3, points[2])
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

  validateTriangles(count: number) {
    try {
      const triangles = selectMany(this.model.faces, face => face.debug ? [] : face.triangles)
      if (triangles.length != count) {
        this.context.fail("Invalid number of triangles: " + triangles.length + " != " +  count)
      }
    } catch (error: any) {
      this.context.fail("Can't get triangles: " + error.stack)
    }
  }

  private static segmentsFrom(segments: readonly SegmentBase[], point: Point): SegmentBase[] {
    for (let index = 0; index < segments.length; index++){
      const segment = segments[index]
      if (segment.begin.equals(point)) {
        return index >= 1 ? [...segments.slice(index), ...segments.slice(0, index)] : [...segments]
      }
    }
    return [...segments]
  }

  private verifyPoint(index: number, actuel: Point, expected: Point) {
    if (!actuel.equals(expected)) {
      this.logging.fail(`actual ${actuel} != expected ${expected}`, `verify point ${index}`)
    }
  }
}
