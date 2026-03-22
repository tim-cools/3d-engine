import {RenderShapeContext, Shape} from "."
import {
  TransformablePoint,
  Transformer,
  Boundaries,
  Space,
  Point,
  Triangle,
  modelColor, Path, ModelType, Point2D
} from "../models"
import {colorLuminance, Colors} from ".."
import {SelectablePath} from "./selectablePath"

export class PathShape implements Shape {

  readonly color: string
  readonly points: readonly TransformablePoint[]
  readonly id: string
  readonly solid: boolean

  constructor(id: string, color: string, points: readonly Point[], solid: boolean = true) {
    this.id = id
    this.color = color
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

    context.rendered(new SelectablePath(this.id + ".selectable", pointsView, this.solid))
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

  static fromTriangle(id: string, debugColors: boolean, triangle: Triangle, solid: boolean = true) {
    const color = this.segmentColor(debugColors, triangle.type)
    return new PathShape(id, color, [triangle.point1, triangle.point2, triangle.point3], solid)
  }

  static fromPolygon(id: string, debugColors: boolean, path: Path, solid: boolean = true) {
    const color = this.segmentColor(debugColors, path.type)
    return new PathShape(id, color, path.points, solid)
  }

  private static segmentColor(debugColors: boolean, type: ModelType) {
    if (debugColors) {
      return modelColor(type)
    }
    return type == ModelType.Utility ? Colors.gray.darker : Colors.primary.middle
  }
}
