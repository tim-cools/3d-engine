import {getIconPath, Icon} from "./icons"
import {AlignHorizontal, AlignVertical, TextStyle, RenderUIContext} from "../renderUIContext"
import {Point2D} from "../../models"
import {nothing, Nothing} from "../../../infrastructure/nothing"
import {ElementArea} from "../elementArea"

export class RenderUICanvasContext implements RenderUIContext {

  readonly canvas: CanvasRenderingContext2D
  readonly offset: Point2D = Point2D.default

  constructor(canvas: CanvasRenderingContext2D, offset: Point2D = Point2D.default) {
    this.canvas = canvas
    this.offset = offset
  }

  fillPath(points: Point2D[], background: string): void {
    const canvas = this.canvas
    canvas.fillStyle = background
    RenderUICanvasContext.addPath(canvas, points)
    canvas.fill()
  }

  fillPathStroke(points: Point2D[], lineWidth: number, borderColor: string, backgroundColor: string): void {
    const canvas = this.canvas
    canvas.strokeStyle = borderColor
    canvas.fillStyle = backgroundColor
    canvas.lineWidth = lineWidth
    RenderUICanvasContext.addPath(canvas, points)
    canvas.fill()
    canvas.stroke()
  }

  fillRectangle(backgroundColor: string, area: ElementArea): void {
    const canvas = this.canvas
    canvas.fillStyle = backgroundColor
    canvas.fillRect(area.left, area.top, area.width, area.height)
  }

  fillRoundRectangle(backgroundColor: string, area: ElementArea, radius: number): void {
    const canvas = this.canvas
    canvas.fillStyle = backgroundColor
    canvas.beginPath()
    canvas.roundRect(area.left, area.top, area.width, area.height, radius)
    canvas.fill()
  }

  rectangle(color: string, area: ElementArea): void {
    const canvas = this.canvas
    canvas.strokeStyle = color
    canvas.rect(area.left, area.top, area.width, area.height)
  }

  text(text: string, color: string, position: Point2D, style: TextStyle | Nothing): void {
    const canvas = this.canvas

    canvas.textAlign = RenderUICanvasContext.textAlignHorizontal(style?.alignHorizontal)
    canvas.textBaseline = RenderUICanvasContext.textAlignVertical(style?.alignVertical)

    const fontSize = style?.fontSize ?? 15
    canvas.font = `${fontSize.toString()}px -apple-system, BlinkMacSystemFont, 'Segoe WPC', 'Segoe UI', 'HelveticaNeue-Light', system-ui, 'Ubuntu', 'Droid Sans', sans-serif`

    const measure = canvas.measureText(text)

    if (style?.backgroundColor) {
      this.fillRectangle(style.backgroundColor, new ElementArea(position.x, position.y, measure.width, measure.actualBoundingBoxDescent))
    }

    canvas.fillStyle = color
    canvas.fillText(text, position.x, position.y, style?.maxWidth)

    if (style != nothing && style.underline) {
      const lineTop = position.y + measure.fontBoundingBoxDescent + 1
      const begin = new Point2D(position.x, lineTop)
      const end = new Point2D(position.x + measure.width, lineTop)
      this.line(begin, end, 2, color)
    }
  }

  line(begin: Point2D, end: Point2D, lineWidth: number, color: string): void {
    const canvas = this.canvas
    canvas.lineWidth = lineWidth
    canvas.strokeStyle = color
    canvas.beginPath()
    canvas.moveTo(begin.x, begin.y)
    canvas.lineTo(end.x, end.y)
    canvas.stroke()
  }

  icon(icon: Icon, color: string, position: Point2D, size: number): void {
    const canvas = this.canvas
    const pathString = getIconPath(icon)
    const path = new Path2D(pathString)
    canvas.fillStyle = color
    canvas.beginPath()
    canvas.translate(position.x, position.y)
    canvas.scale(size / 14, size / 14)
    canvas.fill(path)
    canvas.resetTransform()
  }

  createImage(width: number, height: number, offset: Point2D) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    return new RenderUICanvasContext(context, offset)
  }

  drawImage(context: RenderUIContext, source: ElementArea, target: ElementArea) {
    const canvasContext = context as RenderUICanvasContext
    const image = canvasContext.getImage(source)
    this.canvas.putImageData(image,
      target.left, target.top, 0, 0
      , target.width, target.height)
  }

  private static addPath(canvas: CanvasRenderingContext2D, points: Point2D[]) {
    canvas.beginPath()
    canvas.moveTo(points[points.length - 1].x, points[points.length - 1].y)
    for (let index = 0; index < points.length; index++) {
      canvas.lineTo(points[index].x, points[index].y)
    }
  }

  private static textAlignVertical(alignVertical: AlignVertical | undefined): "top" | "middle" | "bottom" {
    return alignVertical == undefined || alignVertical == AlignVertical.Top
      ? "top"
      : alignVertical == AlignVertical.Bottom ? "bottom" : "middle"
  }

  private static textAlignHorizontal(alignHorizontal: AlignHorizontal | undefined): "left" | "center" | "right" {
    return alignHorizontal == undefined || alignHorizontal == AlignHorizontal.Left
      ? "left"
      : alignHorizontal == AlignHorizontal.Right ? "right" : "center"
  }

  private getImage(source: ElementArea): ImageData {
    return this.canvas.getImageData(source.left, source.top, source.width, source.height)
  }
}
