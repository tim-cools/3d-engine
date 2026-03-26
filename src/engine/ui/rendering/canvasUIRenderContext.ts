import {getIconPath, Icon} from "./icons"
import {TextStyle, UIRenderContext} from "../uiRenderContext"
import {Point2D} from "../../models"
import {ElementArea} from "../elementArea"
import {nothing, Nothing} from "../../../infrastructure/nothing"

export class CanvasUIRenderContext implements UIRenderContext {

  readonly canvas: CanvasRenderingContext2D

  constructor(canvas: CanvasRenderingContext2D) {
    this.canvas = canvas
  }

  fillPath(background: string, points: Point2D[]) {
    const canvas = this.canvas
    canvas.fillStyle = background
    CanvasUIRenderContext.addPath(canvas, points)
    canvas.fill()
  }

  fillPathStroke(border: string, background: string, lineWidth: number, points: Point2D[]) {
    const canvas = this.canvas
    canvas.strokeStyle = border
    canvas.fillStyle = background
    canvas.lineWidth = lineWidth
    CanvasUIRenderContext.addPath(canvas, points)
    canvas.fill()
    canvas.stroke()
  }

  fillRectangle(background: string, left: number, top: number, width: number, height: number): void {
    const canvas = this.canvas
    canvas.fillStyle = background
    canvas.fillRect(left, top, width, height)
  }

  text(color: string, area: ElementArea, text: string, style: TextStyle | Nothing = nothing) {
    const canvas = this.canvas

    canvas.textAlign = "left"
    canvas.textBaseline = "top"
    canvas.fillStyle = color
    canvas.font = "15px -apple-system, BlinkMacSystemFont, 'Segoe WPC', 'Segoe UI', 'HelveticaNeue-Light', system-ui, 'Ubuntu', 'Droid Sans', sans-serif"

    canvas.fillText(text, area.left, area.top + 1)

    if (style != nothing && style.underline) {
      const measure = canvas.measureText(text)
      const top = area.top + measure.fontBoundingBoxDescent + 2
      this.line(color, 2, area.left, top, area.left + measure.width, top)
    }
  }

  line(color: string, lineWidth: number, left: number, top: number, right: number, bottom: number) {
    const canvas = this.canvas
    canvas.lineWidth = lineWidth
    canvas.strokeStyle = color
    canvas.beginPath()
    canvas.moveTo(left, top)
    canvas.lineTo(right, bottom)
    canvas.stroke()
  }

  icon(color: string, icon: Icon, left: number, top: number, size: number): void {
    const canvas = this.canvas
    const pathString = getIconPath(icon)
    const path = new Path2D(pathString)
    canvas.fillStyle = color
    canvas.beginPath()
    canvas.translate(left, top)
    canvas.scale(size / 14, size / 14)
    canvas.fill(path)
    canvas.resetTransform()
  }

  private static addPath(canvas: CanvasRenderingContext2D, points: Point2D[]) {
    canvas.beginPath()
    canvas.moveTo(points[points.length - 1].x, points[points.length - 1].y)
    for (let index = 0; index < points.length; index++) {
      canvas.lineTo(points[index].x, points[index].y)
    }
  }
}

