import {Point2D} from "../models"
import {ElementArea} from "./elementArea"

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

  text(color: string, area: ElementArea, text: string) {
    const canvas = this.canvas
    canvas.fillStyle = color
    canvas.font = "15px -apple-system, BlinkMacSystemFont, 'Segoe WPC', 'Segoe UI', 'HelveticaNeue-Light', system-ui, 'Ubuntu', 'Droid Sans', sans-serif"

    canvas.fillText(text, area.left, area.top + 12)
  }

  private addPath(canvas: CanvasRenderingContext2D, points: Point2D[]) {
    canvas.beginPath()
    canvas.moveTo(points[points.length - 1].x, points[points.length - 1].y)
    for (let index = 0; index < points.length; index++) {
      canvas.lineTo(points[index].x, points[index].y)
    }
  }
}
