import {Point, rotateX, rotateZ, Size} from "../models"
import {LineShape, Shape, UpdatableShape} from "../shapes"
import {BaseObject3D} from "./object"
import {RenderStyle} from "./renderStyle"
import {PathShape} from "../shapes"

export class Rectangle extends BaseObject3D {

  private static plus = 0.5
  private static min = -0.5
  private static leftBottom  = new Point(Rectangle.min,  Rectangle.min,  0)
  private static rightBottom = new Point(Rectangle.plus, Rectangle.min,  0)
  private static leftTop     = new Point(Rectangle.min,  Rectangle.plus, 0)
  private static rightTop    = new Point(Rectangle.plus, Rectangle.plus, 0)

  private readonly color: string
  private readonly shapesValue: UpdatableShape[]
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

  update(timeMilliseconds: number): void {
    const offset = timeMilliseconds / 3600
    for (const shape of this.shapesValue) {
      shape.update([
        //rotateZ(offset),
        //rotateX(offset),
        //rotateY(offset),
      ])
    }
  }

  private createShapes() {
    return this.style == RenderStyle.Wireframe
      ? this.wireframe()
      : this.solid()
  }

  private wireframe() {
    return [
      ...this.segments(this.color, Rectangle.leftBottom, Rectangle.rightBottom),
      ...this.segments(this.color, Rectangle.leftBottom, Rectangle.leftTop),
      ...this.segments(this.color, Rectangle.rightBottom, Rectangle.rightTop),
      ...this.segments(this.color, Rectangle.leftTop, Rectangle.rightTop),
    ]
  }

  private solid() {
    return this.rectangle(this.color, Rectangle.leftBottom, Rectangle.leftTop, Rectangle.rightBottom, Rectangle.rightTop)
  }

  private segments(color: string, begin: Point, end: Point) {

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

      result.push(
        new LineShape(`${this.id}.line.${index}`, color, start, target))

      start = target
    }
    return result
  }

  private rectangle(color: string, leftBottom: Point, leftTop: Point, rightBottom: Point, rightTop: Point) {
    return [
      new LineShape(`${this.id}.line.left`, "black", leftBottom, leftTop),
      new LineShape(`${this.id}.line.top`, "black", leftTop, rightTop),
      new LineShape(`${this.id}.line.right`, "black", rightTop, rightBottom),
      new LineShape(`${this.id}.line.bottom`, "black", rightBottom, leftBottom),
      new PathShape(`${this.id}.rect`, color, [leftBottom, leftTop, rightTop, rightBottom]),
    ]
  }

  private triangles(color: string, leftBottom: Point, leftTop: Point, rightBottom: Point, rightTop: Point) {
    return [
      new LineShape(
        `${this.id}.line.0`,
        "black",
        leftBottom,
        leftTop),
      new LineShape(
        `${this.id}.line.1`,
        "black",
        leftTop,
        rightTop),
      new LineShape(
        `${this.id}.line.2`,
        "black",
        rightTop,
        rightBottom),
      new LineShape(`${this.id}.line.3`,
        "black",
        rightBottom,
        leftBottom),
      new PathShape(
        `${this.id}.path.0`,
        color,
        [leftBottom, leftTop, rightBottom]),
      new PathShape(
        `${this.id}.path.1`,
        color,
        [rightBottom, leftTop, rightTop]),
    ]
  }
}
