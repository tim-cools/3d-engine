import {RenderShapeContext, Shape} from "."
import {
  TransformablePoint,
  Transformer,
  Boundaries,
  Space,
  Point,
  Triangle,
  modelColor, Path, ModelType, Point2D, PrimitiveSource
} from "../models"
import {colorLuminance, Colors} from "../../infrastructure/colors"
import {SelectablePath} from "./selectablePath"
import {nothing, Nothing} from "../../infrastructure/nothing"

export class PathShape implements Shape {

  private readonly source: PrimitiveSource

  readonly color: string
  readonly points: readonly TransformablePoint[]
  readonly solid: boolean

  constructor(color: string, points: readonly Point[], solid: boolean = true, source: PrimitiveSource) {
    this.color = color
    this.source = source
    this.points = points.map(point => new TransformablePoint(point))
    this.solid = solid
  }

  boundaries(space: Space): Boundaries {
    const points = this.transform(space)
    return Boundaries.fromArray(points)
  }

  render(context: RenderShapeContext) {

    if (this.points.length == 0) return;

    const {space, view, canvas} = context
    const points = this.transform(space)
    const pointsView = view.translateMany(points)

    const z = this.zAverage(points)
    const colorFactor = (.6 * z) - .2

    this.setStyle(canvas, colorFactor)
    this.addPath(canvas, pointsView)

    if (this.source != nothing) {
      context.rendered(new SelectablePath(this.source, pointsView, this.solid))
    }
  }

  private setStyle(canvas: CanvasRenderingContext2D, colorFactor: number) {
    if (this.solid) {
      canvas.fillStyle = colorLuminance(this.color, colorFactor)   //todo poor man's 3d coloring
    } else {
      canvas.strokeStyle = colorLuminance(this.color, colorFactor)   //todo poor man's 3d coloring
    }
    canvas.lineWidth = 1
  }

  private addPath(canvas: CanvasRenderingContext2D, pointsView: readonly Point2D[]) {

    canvas.beginPath()
    canvas.moveTo(pointsView[pointsView.length - 1].x, pointsView[pointsView.length - 1].y)
    for (let index = 0; index < pointsView.length; index++) {
      canvas.lineTo(pointsView[index].x, pointsView[index].y)
    }

    if (this.solid) {
      canvas.fill()
    } else {
      canvas.stroke()
    }
  }

  update(transformers: readonly Transformer[]) {
    for (const point of this.points) {
      point.transform(transformers)
    }
  }

  private transform(space: Space) {
    return this.points.map(value => space.translate(value))
  }

  private zAverage(points: Point[]) {
    let sum = 0;
    for (const point of points) {
      sum += point.z
    }
    return sum / points.length
  }

  static fromTriangle(triangle: Triangle, debugColors: boolean, solid: boolean = true, source: PrimitiveSource | Nothing = nothing) {
    const color = this.segmentColor(debugColors, triangle.type)
    return new PathShape(color, [triangle.point1, triangle.point2, triangle.point3], solid, source ?? new PrimitiveSource(triangle))
  }

  static fromPolygon(path: Path, debugColors: boolean, solid: boolean = true, source: PrimitiveSource | Nothing = nothing) {
    const color = this.segmentColor(debugColors, path.type)
    return new PathShape(color, path.points, solid, source ?? new PrimitiveSource(path))
  }

  private static segmentColor(debugColors: boolean, type: ModelType) {
    if (debugColors) {
      return modelColor(type)
    }
    return type == ModelType.Utility ? Colors.gray.darker : Colors.primary.middle
  }
}
