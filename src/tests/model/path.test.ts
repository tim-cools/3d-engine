import {PathBuilder, PathSegment, Point} from "../../engine/models"
import {Verify, VerifyCollectionContext} from "../infrastructure"
import {Assert} from "../../infrastructure"

class PathContext {

  private context: VerifyCollectionContext<PathSegment>

  constructor(context: VerifyCollectionContext<PathSegment>) {
    this.context = context
  }

  length(number: number) {
    this.context.length(number, number + " segments expected")
    return this
  }

  segmentAt(index: number, begin: Point, end: Point) {
    this.context.valueAt(index,
      segment => segment.begin.equals(begin) && segment.end.equals(end),
      ` expected: begin: ${begin} end: ${end}`)
    return this
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
      .valueModelPropertyCollection(0, path => path.segments, context => new PathContext(context)
        .length(3)
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
      .valueModelPropertyCollection(0, path => path.segments, context => new PathContext(context)
        .length(3)
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
      .valueModelPropertyCollection(0, path => path.segments, context => new PathContext(context)
        .length(4)
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
      .valueModelPropertyCollection(0, path => path.segments, context => new PathContext(context)
        .length(4)
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
      .valueModelPropertyCollection(0, path => path.segments, context => new PathContext(context)
        .length(3)
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
      .valueModelPropertyCollection(0, path => path.segments, context => new PathContext(context)
        .length(3)
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
      .valueModelPropertyCollection(0, path => path.segments, context => new PathContext(context)
        .length(4)
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
      .valueModelPropertyCollection(0, path => path.segments, context => new PathContext(context)
        .length(4)
        .segmentAt(0, new Point(0, 0, 0), new Point(1, 0, 0))
        .segmentAt(1, new Point(1, 0, 0), new Point(1, 1, 0))
        .segmentAt(2, new Point(1, 1, 0), new Point(0, 1, 0))
        .segmentAt(3, new Point(0, 1, 0), new Point(0, 0, 0))
      ))
  })
})
