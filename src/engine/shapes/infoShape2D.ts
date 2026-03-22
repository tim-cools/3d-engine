import {RenderShape2DContext, Shape2D} from "."
import {Transformer, Point2D} from "../models"
import {Colors} from ".."

export type Info = {
  scene: string,
  renderStyle: string,
  algorithm: string
}

export class InfoShape2D implements Shape2D {

  readonly id: string
  readonly info: Info

  constructor(id: string, info: Info) {
    this.id = id
    this.info = info
  }

  render(context: RenderShape2DContext) {

    const {view, canvas} = context
    const start = new Point2D(view.width - 350, 50)

    const height = 90
    const width = 300

    this.border(start, height, width, canvas)
    this.infoText(start, canvas)
  }

  update(transformers: readonly Transformer[]) {
  }

  private border(start: Point2D, height: number, width: number, canvas: CanvasRenderingContext2D) {

    const points = [
      start,
      start.add(0, height),
      start.add(width, height),
      start.add(width, 0),
    ]

    canvas.strokeStyle = Colors.ui.border
    canvas.fillStyle = Colors.ui.background
    canvas.lineWidth = 2
    canvas.beginPath()
    canvas.moveTo(points[points.length - 1].x, points[points.length - 1].y)
    for (let index = 0; index < points.length; index++) {
      canvas.lineTo(points[index].x, points[index].y)
    }
    canvas.fill()
    canvas.stroke()
  }

  private infoText(start: Point2D, canvas: CanvasRenderingContext2D) {

    canvas.fillStyle = Colors.ui.textHighlight
    canvas.font = "15px sans-serif"

    const lineHeight = 25
    const paddingX = 15
    const paddingY = 25
    InfoShape2D.addText(canvas, `Scene (0-9): ${this.info.scene}`, start.add(paddingX, paddingY))
    InfoShape2D.addText(canvas, `Render (r): ${this.info.renderStyle}`, start.add(paddingX, paddingY + lineHeight))
    InfoShape2D.addText(canvas, `Algorithm (a): ${this.info.algorithm}`, start.add(paddingX, paddingY + lineHeight * 2))
  }

  private static addText(context: CanvasRenderingContext2D, text: string, position: Point2D) {
    context.fillText(text, position.x, position.y)
  }
}
