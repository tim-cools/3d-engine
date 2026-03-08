import {Shape} from "."
import {Boundaries, modelColor, ModelType, Point, Segment, Space, TransformablePoint, Transformer} from "../models"
import {View2D} from "../view"
import {Colors} from "../colors"

export class LineShape implements Shape {

  readonly id: string
  readonly color: string
  readonly begin: TransformablePoint
  readonly end: TransformablePoint

  constructor(id: string, color: string, begin: Point, end: Point) {
    this.id = id
    this.color = color
    this.begin = new TransformablePoint(begin)
    this.end = new TransformablePoint(end)
  }

  static new(id: string, color: string, xBegin: number, yBegin: number, zBegin: number, xEnd: number, yEnd: number, zEnd: number) {
    const begin = TransformablePoint.new(xBegin, yBegin, zBegin)
    const end = TransformablePoint.new(xEnd, yEnd, zEnd)
    return new LineShape(id,  color, begin, end)
  }

  boundaries(space: Space) {
    const {begin, end} = this.transform(space)
    return Boundaries.fromItems(begin, end)
  }

  render(space: Space, view: View2D, context: CanvasRenderingContext2D) {
    //console.log(`drawLine: (${this.point1.x}, ${this.point1.y}, ${this.point1.z}) (${this.end.x}, ${this.end.y}, ${this.end.z})`)
    const {begin, end} = this.transform(space)
    const beginView = view.translate(begin)
    const endView = view.translate(end)
    //console.log(`drawLine: ${point1.x}, ${point1.y}, ${end.x}, ${end.y}`)
    context.fillStyle = "#000"
    context.strokeStyle = this.color
    context.lineWidth = 3
    context.beginPath()
    context.moveTo(beginView.x, beginView.y)
    context.lineTo(endView.x, endView.y)
    context.stroke()
  }

  update(transformers: readonly Transformer[]) {
    this.begin.transform(transformers)
    this.end.transform(transformers)
  }

  toString() {
    return `line '${this.id}' - begin: '${this.begin}' end: '${this.end}' color: '${this.color}'`
  }

  private transform(space: Space) {
    const begin = space.translate(this.begin)
    const end = space.translate(this.end)
    return {begin, end}
  }

  static fromSegment(id: string, segment: Segment, debugColors: boolean) {
    const color = this.segmentColor(debugColors, segment)
    return new LineShape(id, color, new TransformablePoint(segment.begin), new TransformablePoint(segment.end))
  }

  static fromPoints(id: string, type: ModelType, point1: Point, point2: Point) {
    const color = modelColor(type)
    return new LineShape(id, color, new TransformablePoint(point1), new TransformablePoint(point2))
  }

  private static segmentColor(debugColors: boolean, segment: Segment) {
    return debugColors ? modelColor(segment.type) : segment.type == ModelType.Utility ? Colors.gray.darker : Colors.primary.middle
  }
}
