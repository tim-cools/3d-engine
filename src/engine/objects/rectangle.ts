import {Path, Point, PrimitiveSource, Segment, Size} from "../models"
import {LineShape, Shape} from "../shapes"
import {Object3DBase} from "./object"
import {PathShape} from "../shapes"
import {RenderStyle} from "../state"

export class Rectangle extends Object3DBase {

  private static plus = 0.5
  private static min = -0.5
  private static leftBottom  = new Point(Rectangle.min,  Rectangle.min,  0)
  private static rightBottom = new Point(Rectangle.plus, Rectangle.min,  0)
  private static leftTop     = new Point(Rectangle.min,  Rectangle.plus, 0)
  private static rightTop    = new Point(Rectangle.plus, Rectangle.plus, 0)

  private readonly color: string
  private readonly shapesValue: Shape[]
  private readonly style: RenderStyle

  constructor(id: string, color: string, position: Point, size: Size, style: RenderStyle = RenderStyle.Wireframe) {
    super(id, position, size)
    this.color = color
    this.style = style
    this.shapesValue = this.createShapes()
  }

  shapes(): readonly Shape[] {
    return this.shapesValue
  }

  private createShapes() {
    return this.style == RenderStyle.Wireframe
      ? this.wireframe()
      : this.solid()
  }

  private wireframe() {
    return [
      ...Rectangle.segments(this.color, Rectangle.leftBottom, Rectangle.rightBottom),
      ...Rectangle.segments(this.color, Rectangle.leftBottom, Rectangle.leftTop),
      ...Rectangle.segments(this.color, Rectangle.rightBottom, Rectangle.rightBottom),
      ...Rectangle.segments(this.color, Rectangle.rightBottom, Rectangle.rightTop),
    ]
  }

  private solid() {
    return Rectangle.rectangle(Rectangle.leftBottom, Rectangle.leftTop, Rectangle.rightBottom, Rectangle.rightTop)
  }

  private static segments(color: string, begin: Point, end: Point) {

    const segmentsNumber = 25
    const animateX = begin.x != end.x
    const animateY = begin.y != end.y
    const animateZ = begin.z != end.z

    const xSize = Math.abs(begin.x) + Math.abs(end.x)
    const ySize = Math.abs(begin.y) + Math.abs(end.y)
    const zSize = Math.abs(begin.z) + Math.abs(end.z)
    const ratio = 1 / segmentsNumber

    let start = begin

    const result = []
    for (let index = 1; index <= segmentsNumber; index++) {

      const target = new Point(
        animateX ? xSize * ratio * index + begin.x : begin.x,
        animateY ? ySize * ratio * index + begin.y : begin.y,
        animateZ ? zSize * ratio * index + begin.z : begin.z)

      result.push(new LineShape(color, start, target))

      start = target
    }
    return result
  }

  private static rectangle(leftBottom: Point, leftTop: Point, rightBottom: Point, rightTop: Point) {
    const segment1 = new Segment(leftBottom, leftTop)
    const segment2 = new Segment(leftTop, rightTop)
    const segment3 = new Segment(rightTop, rightBottom)
    const segment4 = new Segment(rightBottom, leftBottom)
    const shape = Path.fromPoints([leftBottom, leftTop, rightTop, rightBottom])
    return [
      LineShape.fromSegment(segment1, false, new PrimitiveSource(segment1, "layers")),
      LineShape.fromSegment(segment2, false, new PrimitiveSource(segment2, "layers")),
      LineShape.fromSegment(segment3, false, new PrimitiveSource(segment3, "layers")),
      LineShape.fromSegment(segment4, false, new PrimitiveSource(segment4, "layers")),
      PathShape.fromPolygon(shape, false, true, new PrimitiveSource(shape, "layers"))
    ]
  }
}
