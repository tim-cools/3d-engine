import {Point2D} from "../models"
import {ElementArea} from "./elementArea"
import {nothing, Nothing} from "../nothing"

export interface TextStyle {
  underline: boolean
}

export class UIRenderContext {

  readonly canvas: CanvasRenderingContext2D

  constructor(canvas: CanvasRenderingContext2D) {
    this.canvas = canvas
  }

  fillPath(background: string, points: Point2D[]) {
    const canvas = this.canvas
    canvas.fillStyle = background
    this.addPath(canvas, points)
    canvas.fill()
  }

  fillPathStroke(border: string, background: string, lineWidth: number, points: Point2D[]) {
    const canvas = this.canvas
    canvas.strokeStyle = border
    canvas.fillStyle = background
    canvas.lineWidth = lineWidth
    this.addPath(canvas, points)
    canvas.fill()
    canvas.stroke()
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


  private addPath(canvas: CanvasRenderingContext2D, points: Point2D[]) {
    canvas.beginPath()
    canvas.moveTo(points[points.length - 1].x, points[points.length - 1].y)
    for (let index = 0; index < points.length; index++) {
      canvas.lineTo(points[index].x, points[index].y)
    }
  }
}
