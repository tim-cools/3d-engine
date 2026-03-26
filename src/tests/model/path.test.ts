import {Path, PathBuilder, Point} from "../../engine/models"
import {Verify, VerifyLogging, VerifyModelContext} from "../infrastructure"
import {Assert} from "../../infrastructure"
import {Nothing} from "../../infrastructure/nothing"

class PathContext {

  private model: Path
  private context: VerifyModelContext<Path>
  private logging: VerifyLogging

  constructor(context: VerifyModelContext<Path>) {
    this.context = context
    this.model = context.model
    this.logging = context.logging
  }

  segments(number: number) {
    this.context.logging.logAssert(this.model.segments.length == number, number + " expected", `segments: ${this.model.segments} - `)
    return this
  }

  triangles(number: number) {
    this.context.logging.logAssert(this.model.triangles.length == number, number + " expected", `triangles: ${this.model.triangles.length} - `)
    return this
  }

  segmentAt(index: number, begin: Point, end: Point) {
    this.valueAt(this.model.segments, index,
      segment => segment.begin.equals(begin) && segment.end.equals(end),
      ` expected: begin: ${begin} end: ${end}`)
    return this
  }

  triangleAt(index: number, point1: Point, point2: Point, point3: Point) {
    this.valueAt(this.model.triangles, index,
      triangle => triangle.point1.equals(point1) && triangle.point2.equals(point2) && triangle.point3.equals(point3),
      ` expected: point1: ${point1} point2: ${point2} point3: ${point3}`)
    return this
  }

  private valueAt<TItem>(collection: readonly TItem[], index: number , verify: (item: TItem) => boolean, message: string | Nothing) {

    const value = index >= 0 && index < collection.length ? collection[index] : null
    if (value != null) {
      let valid = verify(value)
      this.logging.logAssert(valid, message, `- ValueAt[${index}] not as expected: ${value.toString()}`)
      return
    }

    this.logging.logAssert(false, message, `- ValueAt[${index}] invalid: no item. `)
  }
}

describe('build paths', () => {

  test('triangle', async () => {
    const builder = new PathBuilder()
    builder.addSegment(new Point(0, 0, 0), new Point(1, 0, 0))
    builder.addSegment(new Point(1, 0, 0), new Point(0, 1, 0))
    builder.addSegment(new Point(0, 1, 0), new Point(0, 0, 0))

    const paths = Assert.notNull(builder.closePaths(), "path")
    Verify.collection(paths, pathsContext => pathsContext
      .length(1, "paths")
      .valueModel(0, context => new PathContext(context)
        .segments(3)
        .segmentAt(0, new Point(0, 0, 0), new Point(1, 0, 0))
        .segmentAt(1, new Point(1, 0, 0), new Point(0, 1, 0))
        .segmentAt(2, new Point(0, 1, 0), new Point(0, 0, 0))
    ))
  })

  test('close triangle', async () => {
    const builder = new PathBuilder()
    builder.addSegment(new Point(0, 0, 0), new Point(1, 0, 0))
    builder.addSegment(new Point(1, 0, 0), new Point(0, 1, 0))

    const paths = Assert.notNull(builder.closePaths(), "path")
    Verify.collection(paths, pathsContext => pathsContext
      .length(1, "paths")
      .valueModel(0, context => new PathContext(context)
        .segments(3)
        .segmentAt(0, new Point(0, 0, 0), new Point(1, 0, 0))
        .segmentAt(1, new Point(1, 0, 0), new Point(0, 1, 0))
        .segmentAt(2, new Point(0, 1, 0), new Point(0, 0, 0))
      ))
  })

  test('close square', async () => {
    const builder = new PathBuilder()
    builder.addSegment(new Point(0, 0, 0), new Point(1, 0, 0))
    builder.addSegment(new Point(1, 0, 0), new Point(1, 1, 0))
    builder.addSegment(new Point(1, 1, 0), new Point(0, 1, 0))

    const paths = Assert.notNull(builder.closePaths(), "path")
    Verify.collection(paths, pathsContext => pathsContext
      .length(1, "paths")
      .valueModel(0, context => new PathContext(context)
        .segments(4)
        .segmentAt(0, new Point(0, 0, 0), new Point(1, 0, 0))
        .segmentAt(1, new Point(1, 0, 0), new Point(1, 1, 0))
        .segmentAt(2, new Point(1, 1, 0), new Point(0, 1, 0))
        .segmentAt(3, new Point(0, 1, 0), new Point(0, 0, 0))
      ))
  })

  test('close square two lines', async () => {
    const builder = new PathBuilder()
    builder.addSegment(new Point(0, 0, 0), new Point(1, 0, 0))
    builder.addSegment(new Point(1, 1, 0), new Point(0, 1, 0))

    const paths = Assert.notNull(builder.closePaths(), "path")
    Verify.collection(paths, pathsContext => pathsContext
      .length(1, "paths")
      .valueModel(0, context => new PathContext(context)
        .segments(4)
        .segmentAt(0, new Point(0, 0, 0), new Point(1, 0, 0))
        .segmentAt(1, new Point(1, 0, 0), new Point(1, 1, 0))
        .segmentAt(2, new Point(1, 1, 0), new Point(0, 1, 0))
        .segmentAt(3, new Point(0, 1, 0), new Point(0, 0, 0))
      ))
  })

  test('triangle reverse segment', async () => {
    const builder = new PathBuilder()
    builder.addSegment(new Point(0, 0, 0), new Point(1, 0, 0))
    builder.addSegment(new Point(0, 1, 0), new Point(1, 0, 0))
    builder.addSegment(new Point(0, 0, 0), new Point(0, 1, 0))

    const paths = Assert.notNull(builder.closePaths(), "path")
    Verify.collection(paths, pathsContext => pathsContext
      .length(1, "paths")
      .valueModel(0, context => new PathContext(context)
        .segments(3)
        .segmentAt(0, new Point(0, 0, 0), new Point(1, 0, 0))
        .segmentAt(1, new Point(1, 0, 0), new Point(0, 1, 0))
        .segmentAt(2, new Point(0, 1, 0), new Point(0, 0, 0))
      ))
  })

  test('close triangle reverse segment', async () => {
    const builder = new PathBuilder()
    builder.addSegment(new Point(0, 0, 0), new Point(1, 0, 0))
    builder.addSegment(new Point(0, 1, 0), new Point(1, 0, 0))

    const paths = Assert.notNull(builder.closePaths(), "path")
    Verify.collection(paths, pathsContext => pathsContext
      .length(1, "paths")
      .valueModel(0, context => new PathContext(context)
        .segments(3)
        .segmentAt(0, new Point(0, 0, 0), new Point(1, 0, 0))
        .segmentAt(1, new Point(1, 0, 0), new Point(0, 1, 0))
        .segmentAt(2, new Point(0, 1, 0), new Point(0, 0, 0))
      ))
  })

  test('close square reverse segment', async () => {
    const builder = new PathBuilder()
    builder.addSegment(new Point(0, 0, 0), new Point(1, 0, 0))
    builder.addSegment(new Point(1, 1, 0), new Point(1, 0, 0))
    builder.addSegment(new Point(0, 1, 0), new Point(1, 1, 0))

    const paths = Assert.notNull(builder.closePaths(), "path")
    Verify.collection(paths, pathsContext => pathsContext
      .length(1, "paths")
      .valueModel(0, context => new PathContext(context)
        .segments(4)
        .segmentAt(0, new Point(0, 0, 0), new Point(1, 0, 0))
        .segmentAt(1, new Point(1, 0, 0), new Point(1, 1, 0))
        .segmentAt(2, new Point(1, 1, 0), new Point(0, 1, 0))
        .segmentAt(3, new Point(0, 1, 0), new Point(0, 0, 0))
      ))
  })

  test('close square two lines reverse segment', async () => {
    const builder = new PathBuilder()
    builder.addSegment(new Point(0, 0, 0), new Point(1, 0, 0))
    builder.addSegment(new Point(0, 1, 0), new Point(1, 1, 0))

    const paths = Assert.notNull(builder.closePaths(), "path")
    Verify.collection(paths, pathsContext => pathsContext
      .length(1, "paths")
      .valueModel(0, context => new PathContext(context)
        .segments(4)
        .segmentAt(0, new Point(0, 0, 0), new Point(1, 0, 0))
        .segmentAt(1, new Point(1, 0, 0), new Point(1, 1, 0))
        .segmentAt(2, new Point(1, 1, 0), new Point(0, 1, 0))
        .segmentAt(3, new Point(0, 1, 0), new Point(0, 0, 0))
      ))
  })

  test('two connecting triangles', async () => {
    const builder = new PathBuilder()
    builder.addSegment(new Point(0.5, 0.5, 0), new Point(0.5, 0, 0))
    builder.addSegment(new Point(0.5, 0, 0), new Point(1, 0, 0))
    builder.addSegment(new Point(1, 0, 0), new Point(0.5, 0.5, 0))
    builder.addSegment(new Point(0.5, 0.5, 0), new Point(0, 1, 0))
    builder.addSegment(new Point(0, 1, 0), new Point(0, 0.5, 0))
    builder.addSegment(new Point(0, 0.5, 0), new Point(0.5, 0.5, 0))

    const paths = Assert.notNull(builder.closePaths(), "path")
    Verify.collection(paths, pathsContext => pathsContext
      .length(1, "paths")
      .valueModel(0, context => new PathContext(context)
        .segments(6)
        .segmentAt(0, new Point(0.5, 0.5, 0), new Point(0.5, 0, 0))
        .segmentAt(1, new Point(0.5, 0.0, 0), new Point(1, 0, 0))
        .segmentAt(2, new Point(1, 0, 0), new Point(0.5, 0.5, 0))

        .segmentAt(3, new Point(0.5, 0.5, 0), new Point(0, 1, 0))
        .segmentAt(4, new Point(0, 1, 0), new Point(0, 0.5, 0))
        .segmentAt(5, new Point(0, 0.5, 0), new Point(0.5, 0.5, 0))

        .triangles(2)

        .triangleAt(0, new Point(0.5, 0.5, 0), new Point(0.5, 0, 0), new Point(1, 0, 0))
        .triangleAt(1, new Point(0.5, 0.5, 0), new Point(0, 1, 0), new Point(0, .5, 0))
      ))
  })

  test('6 segments', async () => {
    const builder = new PathBuilder()
    builder.addSegment(new Point(2, 2, 0), new Point(2, 3, 0))
    builder.addSegment(new Point(2, 3, 0), new Point(7, 8, 0))
    builder.addSegment(new Point(7, 8, 0), new Point(8, 8, 0))
    builder.addSegment(new Point(8, 7, 0), new Point(3, 2, 0))
    builder.addSegment(new Point(3, 2, 0), new Point(2, 2, 0))

    const paths = Assert.notNull(builder.closePaths(), "path")
    Verify.collection(paths, pathsContext => pathsContext
      .length(1, "paths")
      .valueModel(0, context => new PathContext(context)
        .segments(6)
        .triangles(4)
        .triangleAt(0, new Point(8, 7, 0), new Point(3, 2, 0), new Point(2, 2, 0))
        .triangleAt(1, new Point(8, 7, 0), new Point(2, 2, 0), new Point(2, 3, 0))
        .triangleAt(2, new Point(8, 7, 0), new Point(2, 3, 0), new Point(7, 8, 0))
        .triangleAt(3, new Point(8, 7, 0), new Point(7, 8, 0), new Point(8, 8, 0))
      ))
  })
})
