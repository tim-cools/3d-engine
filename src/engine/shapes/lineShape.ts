import {RenderShapeContext, Shape} from "."
import {Boundaries, modelColor, ModelType, Point, Segment, Space, TransformablePoint, Transformer} from "../models"
import {Colors} from "../colors"
import {SelectableSegment} from "./selectableSegment"

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

  render(context: RenderShapeContext) {

    const {space, view, canvas} = context
    const {begin, end} = this.transform(space)
    const beginView = view.translate(begin)
    const endView = view.translate(end)

    canvas.fillStyle = "#000"
    canvas.strokeStyle = this.color
    canvas.lineWidth = 3
    canvas.beginPath()
    canvas.moveTo(beginView.x, beginView.y)
    canvas.lineTo(endView.x, endView.y)
    canvas.stroke()

    context.rendered(new SelectableSegment(this.id + ".selectable", beginView, endView))
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
    const color = this.segmentColor(debugColors, segment.type)
    return new LineShape(id, color, new TransformablePoint(segment.begin), new TransformablePoint(segment.end))
  }

  static fromPoints(id: string, debugColors: boolean, type: ModelType, point1: Point, point2: Point) {
    const color = this.segmentColor(debugColors, type)
    return new LineShape(id, color, new TransformablePoint(point1), new TransformablePoint(point2))
  }

  private static segmentColor(debugColors: boolean, type: ModelType) {
    return debugColors ? modelColor(type) : type == ModelType.Utility ? Colors.gray.darker : Colors.primary.middle
  }
}
