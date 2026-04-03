import {RenderShapeContext, Shape} from "."
import {
  Boundaries,
  modelColor,
  ModelType,
  Point,
  PrimitiveSource,
  Segment,
  Space,
  TransformablePoint,
  Transformer
} from "../models"
import {Colors} from "../../infrastructure/colors"
import {SelectableSegment} from "./selectableSegment"
import {nothing, Nothing} from "../../infrastructure/nothing"

export class LineShape implements Shape {

  private source: PrimitiveSource | Nothing

  readonly color: string
  readonly begin: TransformablePoint
  readonly end: TransformablePoint

  constructor(color: string, begin: Point, end: Point, source: PrimitiveSource | Nothing = nothing) {
    this.color = color
    this.begin = new TransformablePoint(begin)
    this.end = new TransformablePoint(end)
    this.source = source
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
    canvas.lineWidth = 2
    canvas.beginPath()
    canvas.moveTo(beginView.x, beginView.y)
    canvas.lineTo(endView.x, endView.y)
    canvas.stroke()

    if (this.source != nothing) {
      context.rendered(new SelectableSegment(this.source, beginView, endView))
    }
  }

  update(transformers: readonly Transformer[]) {
    this.begin.transform(transformers)
    this.end.transform(transformers)
  }

  toString() {
    return `line - begin: '${this.begin}' end: '${this.end}' color: '${this.color}'`
  }

  private transform(space: Space) {
    const begin = space.translate(this.begin)
    const end = space.translate(this.end)
    return {begin, end}
  }

  static fromSegment(segment: Segment, debugColors: boolean, source: PrimitiveSource | Nothing = nothing) {
    const color = this.segmentColor(debugColors, segment.type)
    return new LineShape(color, new TransformablePoint(segment.begin), new TransformablePoint(segment.end), source)
  }

  private static segmentColor(debugColors: boolean, type: ModelType) {
    return debugColors ? modelColor(type) : type == ModelType.Utility ? Colors.gray.darker : Colors.primary.middle
  }
}
